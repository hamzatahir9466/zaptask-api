
const requestLogger = async (request, reply) => {
  const start = Date.now();

  reply.raw.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url } = request.raw;
    const traceId = request.traceId;

    request.log.info(
      {
        traceId,
        method,
        path: url,
        duration: `${duration}ms`,
        statusCode: reply.raw.statusCode
      },
      'Handled request'
    );
  });
};

export default requestLogger;