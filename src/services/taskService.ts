import { BASE_URL } from "../constants";
import { request } from "./api";

import { Task } from "../models/Task";
import type { TaskData } from "../types/types";

export async function getTasksByProject(projectId: string): Promise<Task[]> {
	const url = `${BASE_URL}/tasks.json`;

	const data = await request<Record<string, TaskData> | null>(url);

	if (!data) return [];

	const tasks: Task[] = Object.entries(data).map(([taskId, taskData]) => {
		return new Task(taskId, taskData);
	});

	const projectTasks = tasks.filter((task) => {
		return task.getProjectId() === projectId;
	});

	return projectTasks;
}

export async function addTask(taskData: TaskData): Promise<Task> {
	const url = `${BASE_URL}/tasks.json`;

	const options: RequestInit = {
		method: "POST",
		body: JSON.stringify(taskData),
		headers: {
			"Content-Type": "application/json",
		},
	};

	const data = await request<{ name: string }>(url, options);

	const taskId = data.name;

	return new Task(taskId, taskData);
}

export async function deleteTask(taskId: string): Promise<void> {
	const url = `${BASE_URL}/tasks/${taskId}.json`;

	const options: RequestInit = {
		method: "DELETE",
	};

	await request(url, options);
}

export async function updateTask(taskId: string, updates: Partial<TaskData>): Promise<void> {
	const url = `${BASE_URL}/tasks/${taskId}.json`;

	const options: RequestInit = {
		method: "PATCH",
		body: JSON.stringify(updates),
		headers: {
			"Content-Type": "application/json",
		},
	};

	await request<Partial<TaskData>>(url, options);
}
