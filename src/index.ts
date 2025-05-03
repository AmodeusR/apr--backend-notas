import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

fastify.get("/", (req, rep) => {
  return {
    message: "It's working!"
  }
});

fastify.listen({ port: 3157}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
})
