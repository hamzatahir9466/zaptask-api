# ZapTask API

A scalable backend task scheduling API built with Node.js, Fastify, and (soon) Redis.  
Inspired by Zapier-style workflows and built to demonstrate modern backend architecture, event-driven design, and system resilience.

## 🚀 Features (Planned / In Progress)
- ✅ Fastify-based REST API
- ⏳ Redis-backed task queue (coming next)
- ⏳ Delayed execution support
- ⏳ Observability with logging and metrics
- ⏳ Retry / failure handling

## 📦 Stack
- Node.js (ESM)
- Fastify (web framework)
- Redis (upcoming – task queue)
- Pino (logging, built-in with Fastify)
- dotenv (config management)

## 📁 Project Structure

zaptask-api/
├── src/
│ ├── index.js # Main Fastify server
│ ├── routes/ # Route handlers (planned)
│ └── plugins/ # Redis plugin (planned)
├── .env # Config (Redis, etc.)
├── package.json
└── README.md


## 🧪 Running Locally

```bash
npm install
node src/index.js


