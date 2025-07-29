// File: src/plugin/redis.js
import fp from 'fastify-plugin'
import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

async function redisPlugin(fastify, options) {
  const redis = new Redis(process.env.REDIS_URL)

  fastify.decorate('redis', redis)

  fastify.addHook('onClose', async (instance, done) => {
    await redis.quit()
    done()
  })
}

export default fp(redisPlugin)
// This plugin initializes a Redis client and decorates the Fastify instance with it.
// It also ensures that the Redis connection is closed when the Fastify instance is closed.