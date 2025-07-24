


async function taskRoutes(fastify,options){
    fastify.post('/tasks',async(request,reply)=>{

        const { taskId, payload } = request.body;
        if (!taskId || !payload) {
            return reply.status(400).send({ error: 'taskId and payload are required' });
        }
        try {
            // Store the task in Redis
            const taskKey = `task:${taskId}`;
            await fastify.redis.set(taskKey, JSON.stringify({ payload, status: 'pending' }));
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
    fastify.get('/tasks/:taskId', async(request, reply) => {
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
}

export default taskRoutes;