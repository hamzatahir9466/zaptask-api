import fastify from "fastify";


const app = fastify({
  logger: true
});

app.get("/", async (request, reply) => {
  return { message: "ZapTask API is running" };
});

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