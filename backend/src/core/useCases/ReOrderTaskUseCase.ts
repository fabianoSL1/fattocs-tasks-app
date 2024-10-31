import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class ReOrderTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(beforeId: string, afterId: string): Promise<void> {
        const beforeTask = await this.repository.get(beforeId);
        const afterTask = await this.repository.get(afterId);

        if (!beforeTask || !afterTask) {
            throw new Error("task not found");
        }

        this.swapOrder(beforeTask, afterTask);

        await this.repository.save(beforeTask);
        await this.repository.save(afterTask);
    }

    private swapOrder(beforeTask: Task, afterTask: Task): void {
        let aux = beforeTask.order;
        beforeTask.order = afterTask.order;
        afterTask.order = aux;
    }
}