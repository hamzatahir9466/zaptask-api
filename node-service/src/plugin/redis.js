
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