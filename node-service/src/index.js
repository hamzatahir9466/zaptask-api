import fastify from "fastify";
import { v4 as uuidv4 } from 'uuid'
import fastifyMetrics from 'fastify-metrics';

import rootRoute from './routes/root.js'
import taskRoutes from "./routes/tasks.js";
import redisPlugin from './plugin/redis.js';
import requestLogger from './middleware/requestLogger.js';





const app = fastify({
  logger: true
});

await app.register(redisPlugin)
await app.register(rootRoute)
await app.register(taskRoutes);



await app.register(fastifyMetrics, {
  endpoint: '/metrics',
  defaultMetrics: true,
});

// This hook is used to generate a unique trace ID for each request.

app.addHook('onRequest', async (request, reply) => {
  const incomingTraceId = request.headers['x-trace-id'];
  const traceId = incomingTraceId || uuidv4();

  // Attach to request object
  request.traceId = traceId;

  // Include in response header too
  reply.header('X-Trace-ID', traceId);
});

// This hook is used to log the request details and duration after the response is sent.

// Middleware to log request metrics
app.addHook('onResponse', requestLogger);


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