import z from "zod"

export const editTaskSchema = z.object({
    name: z.string(),
    cost: z.string(),
    dateLimit: z.coerce.date()
}).strict();

export type EditTaskRequest = z.infer<typeof editTaskSchema>;
