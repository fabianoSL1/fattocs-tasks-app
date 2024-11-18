import { HTTPException } from "hono/http-exception";
import { EditTaskRequest } from "../../dto/EditTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class EditTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(id: string, request: EditTaskRequest): Promise<Task> {
        

        await this.verifyName(id, request);

        const task = await this.repository.get(id);

        if (!task) {
            throw new HTTPException(404, { cause: "task not found" });
        }

        Object.assign(task, request);

        await this.repository.save(task);

        return task;
    }

    private async verifyName(id: string, task: EditTaskRequest): Promise<void> {
        if (BigInt(task.cost) < 0) {
            throw new HTTPException(400, {cause: "O custo não pode ser negativo"});
        }

        const exist = await this.repository.getByName(task.name);

        if (exist && exist.id !== id) {
            throw new HTTPException(400, {
                cause: "Já existe uma tarefa com este nome.",
            });
        }
    }
}
