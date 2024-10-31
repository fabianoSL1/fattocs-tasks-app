import { Hono } from "hono";

import { ListTasksUseCase, CreateTaskUseCase, EditTaskUseCase, DeleteTaskUseCase } from "../../core/useCases";
import { CreateTaskRequest, EditTaskRequest } from "../../dto";
import { TaskRepository } from "../../core/TaskRepository";
import { MemoryTaskRepository } from "../repository/MemoryTaskRepository";

const route = new Hono();
const taskRepository: TaskRepository = new MemoryTaskRepository();

route.get("/", async ctx => {
    const listTasksUseCase = new ListTasksUseCase(taskRepository);
    const tasks = await listTasksUseCase.execute();

    return ctx.json(tasks);
});

route.post("/", async ctx => {
    const request: CreateTaskRequest = await ctx.req.json();
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);
    const task = await createTaskUseCase.execute(request);

    return ctx.json(task);
})

route.patch("/:id", async ctx => {
    const {id} = ctx.req.param();
    const request: EditTaskRequest = await ctx.req.json();

    const editTaskUseCase = new EditTaskUseCase(taskRepository);
    const task = editTaskUseCase.execute(id, request);

    return ctx.json(task);
});

route.delete("/:id", async ctx => {
    const {id} = ctx.req.param();
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
    const task = deleteTaskUseCase.execute(id);

    return ctx.json(task);
})

export default route;