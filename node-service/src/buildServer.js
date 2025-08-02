// buildServer.js
import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import fastifyMetrics from 'fastify-metrics';

import rootRoute from './routes/root.js';
import taskRoutes from './routes/tasks.js';
import redisPlugin from './plugin/redis.js';
import requestLogger from './middleware/requestLogger.js';

export async function buildServer() {
  const app = fastify({ logger: false }); 
  await app.register(redisPlugin);
  await app.register(rootRoute);
  await app.register(taskRoutes);
  await app.register(fastifyMetrics, {
    endpoint: '/metrics',
    defaultMetrics: true,
  });

  app.addHook('onRequest', async (request, reply) => {
    const incomingTraceId = request.headers['x-trace-id'];
    const traceId = incomingTraceId || uuidv4();
    request.traceId = traceId;
    reply.header('X-Trace-ID', traceId);
  });

  app.addHook('onResponse', requestLogger);

  return app;
}
