import { HTTPException } from "hono/http-exception";
import { CreateTaskRequest } from "../../dto/CreateTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class CreateTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(request: CreateTaskRequest): Promise<Task> {
        await this.verifyTask(request);
        
        const lastTask = await this.repository.getLastTask();

        const order = lastTask ? lastTask.order + 1 : 1;

        const task: Task = {
            ...request,
            order
        }

        return await this.repository.save(task);
    }

    private async verifyTask(task: CreateTaskRequest): Promise<void> {
        if (BigInt(task.cost) < 0) {
            throw new HTTPException(400, {cause: "O custo não pode ser negativo"});
        }

        const exist = await this.repository.getByName(task.name);

        if (exist) {
            throw new HTTPException(400, {cause: "Já existe uma tarefa com esse nome."});
        }
    }
}