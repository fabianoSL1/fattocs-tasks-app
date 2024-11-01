import { ClientException } from "@/exceptions/ClientException";
import { ServerException } from "@/exceptions/ServerException";
import { CreateTaskRequest } from "@/types/createTaskRequest";
import { EditTaskRequest } from "@/types/editTaskRequest";
import { ReOrderTaskRequest } from "@/types/reOrderTaskRequest";
import { Task } from "@/types/Task";

const host = import.meta.env.VITE_HOST;

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
	const response = await fetch(host + path, {
		method: method,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.status >= 500) {
		throw new ServerException("estamos com problemas.");
	}

	const json = await response.json();

	if (response.status >= 400) {
		throw new ClientException(json.message);
	}

	return json as T;
}
