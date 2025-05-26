import type { JwtPayload } from "@typings/auth";
import { FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: JwtPayload;
	}
}
