import { CreateTaskRequest } from "../../dto/CreateTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class CreateTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(request: CreateTaskRequest): Promise<Task> {
        await this.verifyName(request.name);
        
        const lastTask = await this.repository.getLastTask();

        const order = lastTask ? lastTask.order + 1 : 1;

        const task: Task = {
            ...request,
            order
        }

        return await this.repository.save(task);
    }

    private async verifyName(name: string): Promise<void> {
        const exist = await this.repository.getByName(name);

        if (exist) {
            throw new Error("task with this name alrealdy exist");
        }
    }
}