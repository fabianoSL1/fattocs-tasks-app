import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class ListTasksUseCase {
    
    constructor(private readonly repository: TaskRepository) {}

    async execute(): Promise<Task[]> {
        const tasks = await this.repository.list();

        tasks.sort((a, b) =>  a.order - b.order);

        return tasks;
    }
}