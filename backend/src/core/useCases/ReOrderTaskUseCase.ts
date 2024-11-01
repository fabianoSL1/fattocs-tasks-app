import { HTTPException } from "hono/http-exception";
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
        const tasks = await this.tasksToUpdate(direction, request);

        this.verifiyTargetTask(tasks, targetTaskId, request.currentOrder);

        for (const task of tasks) {
            if (task.id === targetTaskId) {
                task.order = request.newOrder;
            } else {
                this.changeOrder(direction, task);
            }

            await this.repository.save(task);
        }
    }

    private changeOrder(direction: Direction, task: Task) {
        if (direction === Direction.after) {
            task.order -= 1;
        } else {
            task.order += 1;
        }
    }

    private getDirection(request: ReOrderTaskRequest) {
        const direction =
            request.currentOrder - request.newOrder < 0
                ? Direction.after
                : Direction.before;

        return direction;
    }

    private async tasksToUpdate(
        direction: Direction,
        request: ReOrderTaskRequest,
    ) {
        let start = request.currentOrder;
        let end = request.newOrder;

        if (direction === Direction.before) {
            start = request.newOrder;
            end = request.currentOrder;
        }

        return await this.repository.listBetweenOrders(start, end);
    }

    private verifiyTargetTask(
        tasks: Task[],
        targetTaskId: string,
        currentOrder: number,
    ) {
        const task = tasks.find((item) => item.id === targetTaskId);

        if (!task || task.order !== currentOrder) {
            throw new HTTPException(400, { cause: "A tarefa já foi reordenada." });
        }
    }
}
