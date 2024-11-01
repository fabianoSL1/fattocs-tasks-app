import { DynamoTaskRepository } from "./DynamoTaskRepository";
import { MemoryTaskRepository } from "./MemoryTaskRepository";


export function TaskRepositoryFactory() {
    if (process.env.STAGE === "PROD") {
        return new DynamoTaskRepository();
    }

    return new MemoryTaskRepository();
}
