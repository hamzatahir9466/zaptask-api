// index.js
import { buildServer } from './buildServer.js';

const start = async () => {
  const app = await buildServer();
  try {
    await app.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
