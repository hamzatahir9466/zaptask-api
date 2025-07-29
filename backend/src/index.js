import fastify from "fastify";
import rootRoute from './routes/root.js'
import taskRoutes from "./routes/tasks.js";
import redisPlugin from './plugin/redis.js';


const app = fastify({
  logger: true
});

await app.register(redisPlugin)
await app.register(rootRoute)
await app.register(taskRoutes);

// This is the main entry point of the application.
// It initializes the Fastify server, registers plugins, and starts listening for requests.

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export default app;