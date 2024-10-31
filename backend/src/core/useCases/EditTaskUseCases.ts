import { EditTaskRequest } from "../../dto/EditTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class EditTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(id: string, request: EditTaskRequest): Promise<Task> {
        await this.verifyName(request.name);

        const task = await this.repository.get(id);
        
        if (!task) {
            throw new Error("task not found");
        }

        Object.assign(task, request);

        await this.repository.save(task);

        return task;
    }

    private async verifyName(name: string): Promise<void> {
        const exist = await this.repository.getByName(name);

        if (exist) {
            throw new Error("task with this name alrealdy exist");
        }
    }
}