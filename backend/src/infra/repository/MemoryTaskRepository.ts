import { Task } from "../../core/Task";
import { TaskRepository } from "../../core/TaskRepository";

export class MemoryTaskRepository implements TaskRepository {
    private tasks: Map<String, Task> = new Map();

    async save(task: Task): Promise<Task> {
        task.id = crypto.randomUUID();

        this.tasks.set(task.id, task);

        return task;
    }

    async destroy(id: string): Promise<void> {
        this.tasks.delete(id);
    }

    async list(): Promise<Task[]> {
        const tasks = this.tasks.values();
        return Array.from(tasks);
    }

    async get(id: string): Promise<Task | undefined> {
        return this.tasks.get(id);
    }

    async getByName(name: string): Promise<Task | undefined> {
        const tasks = await this.list();
        return tasks.find(task => task.name == name);
    }

    async getLastTask(): Promise<Task | undefined> {
        const tasks = await this.list();

        return tasks.reduce((previous, current) => {
            return current.order > previous.order ? current : previous
        })
    }

}