import { authRoutes } from "@routes/authRoutes";
import { notesRoutes } from "@routes/notesRoutes";
import Fastify from "fastify";

const fastify = Fastify({
	logger: true,
});

fastify.register(authRoutes, { prefix: "auth/" });
fastify.register(notesRoutes);

fastify.get("/", () => {
	return {
		message: "Go to /notes route to utilize this api!",
	};
});

fastify.listen({ port: 3157 }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`server listening on ${address}`);
});
