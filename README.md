# ZapTask API

ZapTask is a lightweight task queue API built with Fastify and Redis. It lets you submit tasks through a POST endpoint and processes them in the background using a worker script. You can fetch task status, filter by status, or delete tasks. Tasks automatically expire after a set time using Redis TTL.

This project explores async job processing, Redis caching, and modern backend patterns using Node.js with ESM.


 ## Tech Stack

| Component            | Technologies                                 |
|----------------------|----------------------------------------------|
| Task API             | Node.js (ESM), Fastify, Redis, ioredis       |
| Background Worker    | Node.js, Redis                               |
| Logging              | Pino (structured logging)                    |
| AI Suggestion Service| Python, FastAPI, OpenAI API (GPT-4), Pydantic|
| Config Management    | dotenv                                        |


## Features

- Submit new tasks using POST /tasks  
- Background worker processes tasks asynchronously  
- Check status of a specific task using GET /tasks/:id  
- List all tasks or filter them by status using GET /tasks  
- Delete tasks using DELETE /tasks/:id  
- Auto-expire tasks using Redis TTL  
- Tracks task IDs using a Redis Set for efficient querying
- **Observability:** Add metrics, tracing, and logging enhancements (e.g., Prometheus or Grafana).
- **Smart Task Suggestions (LLM Integration):** Integrating GPT-4 via OpenAI API to suggest task titles and categorize submissions intelligently.
- **Inter-Service Communication:** API-layer bridge between Node.js service and the AI microservice built with FastAPI.
- **Trace IDs:** Add request/trace ID support for debugging across services.

  ---

## In Progress
-  **Test Coverage:** Unit and integration tests using Jest.

---

## Planned Features

-  **Authentication:** Add API key or token-based auth.
-  **Task Tagging:** Allow users to tag or categorize tasks.


---

## Getting Started

Clone the repository and install dependencies

```bash
npm install

```
Set up your environment by creating a .env file based on .env.example

REDIS_URL=redis://localhost:6379

Run the API server

```bash
npm run dev
```

Server starts at http://localhost:3000

Run the background worker
```bash
node worker.js
```

The worker checks for new tasks every few seconds and updates their status.

## API Overview

# POST /tasks

Submit a new task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"taskId": "abc", "payload": "Test"}'
```
Returns

```
{
  "taskId": "task:abc123",
  "status": "pending"
}

```

## GET /tasks/:id

Fetch a specific task’s status

```
curl http://localhost:3000/tasks/task:abc123
```

## GET /tasks?status=processing

Returns all tasks, optionally filtered by status

```
curl http://localhost:3000/tasks?status=completed
```

## DELETE /tasks/:id

Removes a task from Redis and the internal set

```
curl -X DELETE http://localhost:3000/tasks/task:abc123

```

## How it Works
When you POST a task, it is saved in Redis with a pending status and an expiration timer. A background worker picks it up, simulates processing, and updates the status to completed.

All task IDs are tracked in a Redis set called tasks. This allows the system to scan for keys without relying on expensive pattern matching. Tasks that expire naturally are removed from the set during GET requests if their keys no longer exist.

The system demonstrates basic ideas behind background processing, caching, TTL-based cleanup, and RESTful API design.

## Notes
This project was built as a portfolio piece to explore Fastify, Redis, and event-driven backend patterns. It’s a great starting point for building more advanced task systems with queues or observability.



