
import fetch from 'node-fetch';


async function taskRoutes(fastify, options) {
    fastify.post('/tasks', async (request, reply) => {

        let suggested_task = "Untitled Task";
        let category = "Uncategorized";


        const { taskId, payload } = request.body;
        if (!taskId || !payload) {
            return reply.status(400).send({ error: 'taskId and payload are required' });
        }
        try {
            // Store the task in Redis

            const aiRes = await fetch("http://localhost:8001/suggest",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: payload })
                })

            if (aiRes.ok) {
                const data = await aiRes.json();
                suggested_task = data.suggested_task;
                category = data.category;
            }


            const taskKey = `task:${taskId}`;

            const taskData = {
                taskId:taskKey,
                payload,
                suggested_task,
                category,
                status: 'pending',
                createdAt: new Date().toISOString()
            };  

           // await fastify.redis.hmset(taskKey, taskData); // Store task data as a hash in Redis 

            await fastify.redis.set(taskKey, JSON.stringify(taskData));
            await fastify.redis.sadd('tasks', taskKey); // Add task key to a set for easy retrieval
            return reply.status(201).send({ taskId, status: 'scheduled' });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to create task' });
        }
    })

    // Endpoint to retrieve a task by its ID
    // This endpoint allows users to fetch the details of a specific task using its taskId.
    fastify.get('/tasks/:taskId', async (request, reply) => {
        const { taskId } = request.params;
        if (!taskId) {
            return reply.status(400).send({ error: 'taskId is required' });
        }
        try {
            // Retrieve the task from Redis
            const taskKey = `task:${taskId}`;
            const taskData = await fastify.redis.get(taskKey);
            if (!taskData) {
                return reply.status(404).send({ error: 'Task not found' });
            }
            return reply.send(JSON.parse(taskData));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to retrieve task' });
        }
    });


    fastify.get('/tasks', async (request, reply) => {

        try {

            const taskId = await fastify.redis.smembers('tasks');
            const { status } = request.query;

            if (!taskId || taskId.length === 0) {
                return reply.status(404).send({ error: 'No tasks found' });
            }
            const tasks = await Promise.all(taskId.map(async (id) => {
                const taskData = await fastify.redis.get(id);
                if (!taskData) {
                    await fastify.redis.srem('tasks', id); // Remove stale task key
                    return null; // Skip this task if it doesn't exist
                }

                const parsed = JSON.parse(taskData);

                // Now you can safely access `parsed.status`
                if (status && parsed.status !== status) {
                    return null;
                }

                return parsed;
            }));

            const filteredTasks = tasks.filter(task => task !== null);
            return reply.status(200).send({ 'tasks': filteredTasks, 'count': filteredTasks.length, status: 'success' });


        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to retrieve tasks' });
        }
        // Retrieve all tasks from Redis
    });


    fastify.delete('/tasks/:taskid', async (request, reply) => {

        const { taskid } = request.params;
        if (!taskid) {
            return reply.status(400).send({ error: 'taskId is required' });
        }
        try {

            const taskKey = `task:${taskid}`;
            const taskData = await fastify.redis.get(taskKey);
            if (!taskData) {
                return reply.status(404).send({ error: 'Task not found' });
            }
            await fastify.redis.del(taskKey); // Delete the task from Redis
            await fastify.redis.srem('tasks', taskKey); // Remove the task key from the set
            return reply.status(200).send({ message: 'Task deleted successfully' });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to delete task' });
        }

    });
}

export default taskRoutes;