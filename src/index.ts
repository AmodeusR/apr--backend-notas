import Fastify from "fastify";
import { notesRoutes } from "@routes/notesRoutes";

const fastify = Fastify({
  logger: true
});

fastify.register(notesRoutes);

fastify.get("/", () => {
  return {
    message: "Go to /notes route to utilize this api!"
  }
});

fastify.listen({ port: 3157}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
})
