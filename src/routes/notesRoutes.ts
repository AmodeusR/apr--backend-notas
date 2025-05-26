import { db } from "@lib/prisma";
import type { Params } from "@typings/notes";
import type { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "generated/prisma/internal/prismaNamespace";
import { validateJWT } from "middleware/auth";
import { NoteSchema } from "schemas";
import { parseZodIssues } from "utils/parseZodIssues";

export function notesRoutes(fastify: FastifyInstance) {
	fastify.decorateRequest("user");
	fastify.addHook("preHandler", validateJWT);

	// Get notes
	fastify.get("/notes", async (req) => {
		const user = req.user;

		const notes = await db.note.findMany({ where: {
			userId: user.userId
		}});

		return {
			notes,
		};
	});

	// Get one note
	fastify.get<{ Params: Params }>("/notes/:id", async (req, reply) => {
		const { id } = req.params;
		const note = await db.note.findUnique({
			where: {
				id,
			},
		});

		if (note === null) {
			return reply.status(404).send({ message: "Note not found" });
		}

		return {
			note,
		};
	});

	// Create a note
	fastify.post("/notes", async (req, reply) => {
		const { body: noteBody, user } = req;

		const { success, data, error } = NoteSchema.safeParse(noteBody);

		if (!success) {
			const { message } = parseZodIssues(error.issues);

			return reply.status(400).send({ message });
		}

		const dbNote = await db.note.create({
			data: { ...data, userId: user.userId },
		});

		return reply.status(201).send({ note: dbNote });
	});

	// Update note
	fastify.put<{ Params: Params }>("/notes/:id", async (req, reply) => {
		const { id } = req.params;
		const body = req.body;
		const NoteSchemaPartial = NoteSchema.partial();
		const { success, data, error } = NoteSchemaPartial.safeParse(body);

		if (!success) {
			const { message } = parseZodIssues(error.issues);

			return reply.status(400).send({ message });
		}

		try {
			await db.note.update({ where: { id }, data });
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return reply.status(404).send({ message: "Note doesn't exist." });
				}
			}

			return reply.status(500).send();
		}

		return reply.status(200).send();
	});

	// Delete a note
	fastify.delete<{ Params: Params }>("/notes/:id", async (req, reply) => {
		const { id } = req.params;

		try {
			await db.note.delete({ where: { id } });
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					return reply.status(404).send({ message: "note doesn't exist." });
				}
			}

			return reply.status(500).send();
		}

		return reply.status(204).send();
	});
}
