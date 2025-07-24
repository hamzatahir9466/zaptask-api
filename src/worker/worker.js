
import redis from 'ioredis';
import dotenv from 'dotenv';


dotenv.config();
const redisClient = new redis(process.env.REDIS_URL);
// This worker script connects to Redis and listens for tasks.

async function processTask() {

    const keys = await redisClient.keys('task:*');

    for (const key of keys) {
        const taskData = await redisClient.get(key);
        const task = JSON.parse(taskData);
        if (task.status === 'pending') {
            console.log(`Processing task key : ${key} with payload:${task.payload} and status: ${task.status}`);

            redisClient.set(key, JSON.stringify({ ...task, status: 'processing' }));
            // Simulate task processing
            await handleTask(key, task.payload);
            // After processing, you might want to update the task status in Redis
            await redisClient.set(key, JSON.stringify({ ...task, status: 'completed' }));
        }
    }
}

async function handleTask(taskId, payload) {
    // Simulate some processing time
    await new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Task ${taskId} processed with payload:`, payload);
            resolve();
        }, 3000); // Simulating a 1 second task processing time
    });
}

// Run every 5 seconds
setInterval(processTask, 5000)

console.log('🛠️ Task Worker running...')