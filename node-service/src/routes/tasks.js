
//import fetch from 'node-fetch';
import { fetch } from 'undici';



global.fetch = fetch;

async function taskRoutes(fastify, options) {
    fastify.post('/tasks', async (request, reply) => {


        let suggested_task = "Untitled Task";
        let category = "Uncategorized";
        request.log.info({ traceId: request.traceId, payload: request.body }, 'New task received');
        // log.info({ traceId: request.traceId, payload: request.body }, 'New task received');


        const { taskId, payload } = request.body;
        if (!taskId || !payload) {
            return reply.status(400).send({ error: 'taskId and payload are required' });
        }
        try {
            // Store the task in Redis

            const aiRes = await global.fetch("http://localhost:8001/suggest",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: payload })
                })

            if (aiRes.ok) {
                const data = await aiRes.json();
                suggested_task = data.suggested_task;
                category = data.category;
            } else {
                log.warn(`AI service returned status ${aiResponse.status}`);
            }


            const taskKey = `task:${taskId}`;

            const taskData = {
                taskId: taskKey,
                payload,
                suggested_task,
                category,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // await fastify.redis.hmset(taskKey, taskData); // Store task data as a hash in Redis 

            await fastify.redis.set(taskKey, JSON.stringify(taskData));
            await fastify.redis.sadd('tasks', taskKey);
            return reply.status(201).send({ taskId, status: 'scheduled' });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to create task' });
        }
    })

    fastify.get('/tasks/:taskId', async (request, reply) => {
        const { taskId } = request.params;

        request.log.info({ traceId: request.traceId, taskId: taskId }, 'Fetching task');
        if (!taskId) {
            request.log.warn({ traceId: request.traceId, taskId: taskId }, 'Task not found');
            return reply.status(400).send({ error: 'taskId is required' });
        }
        try {
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
            request.log.info({ traceId: request.traceId, status }, 'Listing tasks');

            if (!taskId || taskId.length === 0) {
                return reply.status(404).send({ error: 'No tasks found' });
            }
            const tasks = await Promise.all(taskId.map(async (id) => {
                const taskData = await fastify.redis.get(id);
                if (!taskData) {
                    await fastify.redis.srem('tasks', id);
                    return null;
                }

                const parsed = JSON.parse(taskData);

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
            await fastify.redis.del(taskKey);
            await fastify.redis.srem('tasks', taskKey);
            return reply.status(200).send({ message: 'Task deleted successfully' });
        } catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to delete task' });
        }

    });
}

export default taskRoutes;