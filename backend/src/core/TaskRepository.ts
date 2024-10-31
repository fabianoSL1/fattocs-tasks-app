import { Task } from "./Task";

export interface TaskRepository {
    save(task: Task): Promise<Task>;
    destroy(id: string): Promise<void>;
    list(): Promise<Task[]>;
    listAfterOrder(order: number): Promise<Task[]>;
    listBeforeOrder(order: number): Promise<Task[]>;
    get(id: string): Promise<Task|undefined>;
    getByName(name: string): Promise<Task|undefined>;
    getLastTask(): Promise<Task|undefined>;
}
