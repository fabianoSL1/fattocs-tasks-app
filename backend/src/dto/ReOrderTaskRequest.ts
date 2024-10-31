import z from "zod";

export const reOrderTaskSchema = z.object({
    currentOrder: z.number(),
    newOrder: z.number()
}).strict();


export type ReOrderTaskRequest = z.infer<typeof reOrderTaskSchema>;