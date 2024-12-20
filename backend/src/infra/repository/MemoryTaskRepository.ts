import { Task } from "../../core/Task";
import { TaskRepository } from "../../core/TaskRepository";

export class MemoryTaskRepository implements TaskRepository {
    private tasks: Map<string, Task> = new Map();

    async save(task: Task): Promise<Task> {
        if (!task.id) {
            task.id = crypto.randomUUID();
        }

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

    async listBetweenOrders(start: number, end: number): Promise<Task[]> {
        const tasks = await this.list();
        return tasks.filter((item) => item.order >= start && item.order <= end);
    }

    async get(id: string): Promise<Task | undefined> {
        return this.tasks.get(id);
    }

    async getByName(name: string): Promise<Task | undefined> {
        const tasks = await this.list();
        return tasks.find((task) => task.name === name);
    }

    async getLastTask(): Promise<Task | undefined> {
        const tasks = await this.list();

        if (tasks.length) {
            return tasks.reduce((previous, current) => {
                return current.order > previous.order ? current : previous;
            });
        }
    }
}
