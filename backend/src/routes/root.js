
async function routes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { message: 'ZapTask API is running ' }
  })
}

export default routes