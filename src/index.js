import fastify from "fastify";
import rootRoute from './routes/root.js'


const app = fastify({
  logger: true
});

//await fastify.register(redisPlugin)
await app.register(rootRoute)

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