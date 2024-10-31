import z from "zod"

export const createTaskSchema = z.object({
    name: z.string(),
    cost: z.number(),
    dateLimit: z.coerce.date()
}).strict();

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
