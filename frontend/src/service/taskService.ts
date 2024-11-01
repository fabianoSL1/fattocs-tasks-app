import { CreateTaskRequest } from "@/types/createTaskRequest";
import { EditTaskRequest } from "@/types/editTaskRequest";
import { ReOrderTaskRequest } from "@/types/reOrderTaskRequest";
import { Task } from "@/types/Task";

export async function getTasks(): Promise<Task[]> {
	return await makeRequest<Task[]>({
		path: "/tasks",
		method: "GET",
	});
}
export async function createTask(request: CreateTaskRequest): Promise<Task> {
	return await makeRequest<Task>({
		path: "/tasks",
		method: "POST",
		body: request,
	});
}

export async function deleteTask(id: string): Promise<Task> {
	return await makeRequest<Task>({
		path: `/tasks/${id}`,
		method: "DELETE",
	});
}

export async function editTask(
	id: string,
	request: EditTaskRequest,
): Promise<Task> {
	return await makeRequest<Task>({
		path: `/tasks/${id}`,
		method: "PATCH",
		body: request,
	});
}

export async function reOrderTask(
	id: string,
	request: ReOrderTaskRequest,
): Promise<Task> {
	return await makeRequest<Task>({
		path: `/tasks/${id}/order`,
		method: "PATCH",
		body: request,
	});
}

type Params = {
	path: string;
	method: "GET" | "POST" | "PATCH" | "DELETE";
	body?: unknown;
};

async function makeRequest<T>({ path, method, body }: Params) {
	const response = await fetch(`${path}`, {
		method: method,
		body: JSON.stringify(body),
	});

	const json = await response.json();
	return json as T;
}
