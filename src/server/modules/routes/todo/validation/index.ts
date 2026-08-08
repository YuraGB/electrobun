import z from "zod";

export const todoSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string().nullable(),
	completed: z.boolean().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	userId: z.number(),
});
