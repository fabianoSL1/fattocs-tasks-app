import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class DeleteTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(id: string): Promise<Task> {
        const task = await this.repository.get(id);

        if (!task) {
            throw new Error("task not fount");
        } 

        await this.repository.destroy(id);
        return task;
    }
}