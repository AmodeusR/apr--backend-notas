import { authRoutes } from "@routes/authRoutes";
import { notesRoutes } from "@routes/notesRoutes";
import Fastify from "fastify";
import cookie, { type FastifyCookieOptions } from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
	logger: true,
});

// Swagger is not properly working with bun at the moment because of some kind of bug
// https://github.com/oven-sh/bun/issues/20428
fastify.register(fastifySwagger, {
	openapi: {
		info: {
			title: "API Notes",
			description: "A note creation API with user auth",
			version: "1.0.0"
		}
	}
});

fastify.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

fastify.register(fastifyCors, { origin: "*"});
fastify.register(cookie, {
	secret: process.env.COOKIE_SECRET
} as FastifyCookieOptions);
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
