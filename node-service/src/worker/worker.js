
import redis from 'ioredis';
import dotenv from 'dotenv';


dotenv.config();
const redisClient = new redis(process.env.REDIS_URL);
// This worker script connects to Redis and listens for tasks.

async function processTask() {

    const keys = await redisClient.smembers('tasks');

    for (const key of keys) {
        const taskData = await redisClient.get(key);
        const task = JSON.parse(taskData);
        if (task&&task.status === 'pending') {
            console.log(`Processing task key : ${key} with payload:${task.payload} and status: ${task.status}`);

            redisClient.set(key, JSON.stringify({ ...task, status: 'processing' }),'EX',100);
           
            await handleTask(key, task.payload);
            await redisClient.set(key, JSON.stringify({ ...task, status: 'completed' }),'EX',100);

            await redisClient.sadd('tasks',key,'EX',100); 

         //   await redisClient.srem('tasks', key); // Remove the task from the set after processing
        }
    }
}

async function handleTask(taskId, payload) {
    await new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Task ${taskId} processed with payload:`, payload);
            resolve();
        }, 3000); 
    });
}


setInterval(processTask, 5000)

console.log('🛠️ Task Worker running...')