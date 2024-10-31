import { ReOrderTaskRequest } from "../../dto/ReOrderTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

enum Direction {
    after = 0,
    before = 1,
}

export class ReOrderTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(
        targetTaskId: string,
        request: ReOrderTaskRequest,
    ): Promise<void> {
        const direction = this.getDirection(request);
        const tasks = await this.tasksToUpdate(direction, request.newOrder);

        this.verifiyTargetTask(tasks, targetTaskId, request.currentOrder);

        for (const task of tasks) {
            if (task.id === targetTaskId) {
                task.order = request.newOrder;
                continue;
            }

            if (direction === Direction.after) {
                task.order -= 1;
            } else {
                task.order += 1;
            }

            await this.repository.save(task);
        }
    }

    private verifiyTargetTask(
        tasks: Task[],
        targetTaskId: string,
        currentOrder: number,
    ) {
        const task = tasks.find((item) => item.id === targetTaskId);

        if (!task) {
            throw new Error("task not found");
        }

        if (task.order !== currentOrder) {
            throw new Error("task has been modified");
        }
    }

    private getDirection(request: ReOrderTaskRequest) {
        const direction =
            request.currentOrder - request.newOrder < 0
                ? Direction.after
                : Direction.before;

        return direction;
    }

    private async tasksToUpdate(direction: Direction, order: number) {
        let tasks: Task[];

        if (direction === Direction.after) {
            tasks = await this.repository.listBeforeOrder(order);
        } else {
            tasks = await this.repository.listAfterOrder(order);
        }

        return tasks;
    }
}
