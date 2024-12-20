import { Task } from "./Task";

export interface TaskRepository {
    save(task: Task): Promise<Task>;
    destroy(id: string): Promise<void>;
    list(): Promise<Task[]>;
    listBetweenOrders(start: number, end: number): Promise<Task[]>;
    get(id: string): Promise<Task|undefined>;
    getByName(name: string): Promise<Task|undefined>;
    getLastTask(): Promise<Task|undefined>;
}
