import { randomUUID } from "node:crypto";

import {
    DynamoDBDocumentClient,
    DeleteCommand,
    PutCommand,
    GetCommand,
    ScanCommand,
    ScanCommandInput,
    NumberValue,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { Task } from "../../core/Task";
import { TaskRepository } from "../../core/TaskRepository";

// biome-ignore lint/suspicious/noExplicitAny: A lib do dynamo utiliza Record<string, any>
type Item = Record<string, any>;

export class DynamoTaskRepository implements TaskRepository {
    private client: DynamoDBDocumentClient;
    private table: string;

    constructor() {
        const table = process.env.TABLE_TASK;

        if (!table) {
            throw new Error("TABLE_TASK is not defined");
        }

        this.table = table;

        this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    }

    async save(task: Task): Promise<Task> {
        if (!task.id) {
            task.id = randomUUID();
        }

        const command = new PutCommand({
            TableName: this.table,
            Item: {
                ...task,
                dateLimit: task.dateLimit.toISOString(),
                cost: new NumberValue(task.cost),
            },
        });

        await this.client.send(command);

        return task;
    }

    async destroy(id: string): Promise<void> {
        const command = new DeleteCommand({
            Key: { id },
            TableName: this.table,
        });

        await this.client.send(command);
    }

    async list(): Promise<Task[]> {
        const result = await this.bachScanCommand({ TableName: this.table });
        return this.parseItems(result);
    }

    async listBetweenOrders(start: number, end: number): Promise<Task[]> {
        const result = await this.bachScanCommand({
            TableName: this.table,
            FilterExpression: "#order between :start and :end",
            ExpressionAttributeNames: {
                "#order": "order",
            },
            ExpressionAttributeValues: {
                ":start": start,
                ":end": end,
            },
        });

        return this.parseItems(result);
    }

    async get(id: string): Promise<Task | undefined> {
        const command = new GetCommand({
            Key: { id },
            TableName: this.table,
        });

        const result = await this.client.send(command);

        if (result.Item) {
            return this.parse(result.Item);
        }
    }

    async getByName(name: string): Promise<Task | undefined> {
        const result = await this.bachScanCommand({
            TableName: this.table,
            FilterExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": name,
            },
        });

        const [task] = this.parseItems(result);
        return task;
    }

    async getLastTask(): Promise<Task | undefined> {
        const tasks = await this.list();

        if (tasks.length) {
            return tasks.reduce((previous, current) => {
                return current.order > previous.order ? current : previous;
            });
        }
    }

    private async bachScanCommand(
        commandInput: ScanCommandInput,
    ): Promise<Item[]> {
        let start: Record<string, string> | undefined;
        const items = [];

        do {
            const command = new ScanCommand({
                ...commandInput,
                ExclusiveStartKey: start,
            });

            const result = await this.client.send(command);
            start = result.LastEvaluatedKey;

            if (result.Items) {
                items.push(...result.Items);
            }
        } while (start !== undefined);

        return items;
    }

    private parseItems(items: Item[]) {
        const tasks: Task[] = [];

        for (const item of items) {
            tasks.push(this.parse(item));
        }

        return tasks;
    }

    private parse(item: Item): Task {
        const task: Task = {
            id: item.id,
            name: item.name,
            cost: (item.cost as NumberValue).toString(),
            order: item.order,
            dateLimit: new Date(item.dateLimit),
        };

        return task;
    }
}
