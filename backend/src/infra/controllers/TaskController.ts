import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import {
    ListTasksUseCase,
    CreateTaskUseCase,
    EditTaskUseCase,
    DeleteTaskUseCase,
    ReOrderTaskUseCase,
} from "../../core/useCases";
import {
    CreateTaskRequest,
    createTaskSchema,
    EditTaskRequest,
    editTaskSchema,
    ReOrderTaskRequest,
    reOrderTaskSchema,
} from "../../dto";
import { TaskRepository } from "../../core/TaskRepository";
import { MemoryTaskRepository } from "../repository/MemoryTaskRepository";

const route = new Hono();
const taskRepository: TaskRepository = new MemoryTaskRepository();

route.get("/", async (ctx) => {
    const listTasksUseCase = new ListTasksUseCase(taskRepository);
    const tasks = await listTasksUseCase.execute();

    return ctx.json(tasks);
});

route.post("/", zValidator("json", createTaskSchema), async (ctx) => {
    const request: CreateTaskRequest = ctx.req.valid("json");
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);
    const task = await createTaskUseCase.execute(request);

    return ctx.json(task);
});

route.patch("/:id", zValidator("json", editTaskSchema), async (ctx) => {
    const { id } = ctx.req.param();
    const request: EditTaskRequest = ctx.req.valid("json");

    const editTaskUseCase = new EditTaskUseCase(taskRepository);
    const task = await editTaskUseCase.execute(id, request);

    return ctx.json(task);
});

route.patch("/:id/order", zValidator("json", reOrderTaskSchema), async (ctx) => {
    const { id } = ctx.req.param();
    const request: ReOrderTaskRequest = ctx.req.valid("json");

    const reOrderTaskUseCase = new ReOrderTaskUseCase(taskRepository);
    await reOrderTaskUseCase.execute(id, request);

    return ctx.json({});
});

route.delete("/:id", async (ctx) => {
    const { id } = ctx.req.param();
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    const task = await deleteTaskUseCase.execute(id);

    return ctx.json(task);
});

export default route;
