import { HTTPException } from "hono/http-exception";
import { EditTaskRequest } from "../../dto/EditTaskRequest";
import { Task } from "../Task";
import { TaskRepository } from "../TaskRepository";

export class EditTaskUseCase {
    constructor(private readonly repository: TaskRepository) {}

    async execute(id: string, request: EditTaskRequest): Promise<Task> {
        await this.verifyName(id, request.name);

        const task = await this.repository.get(id);

        if (!task) {
            throw new HTTPException(404, { cause: "task not found" });
        }

        Object.assign(task, request);

        await this.repository.save(task);

        return task;
    }

    private async verifyName(id: string, name: string): Promise<void> {
        const exist = await this.repository.getByName(name);

        if (exist && exist.id !== id) {
            throw new HTTPException(400, {
                cause: "Já existe uma tarefa com este nome.",
            });
        }
    }
}
