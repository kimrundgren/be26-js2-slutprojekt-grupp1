import { BASE_URL } from "../constants";
import { request } from "./api";

import { Task } from "../models/Task";
import type { TaskData } from "../types/types";

/**
 * Fetches all tasks belonging to a specific project.
 *
 * @param projectId - The ID of the project.
 * @returns The tasks belonging to the project.
 * @throws An error if the API request fails.
 */
export async function getTasksByProject(projectId: string): Promise<Task[]> {
	const url = `${BASE_URL}/tasks.json`;

	const data = await request<Record<string, TaskData> | null>(url);

	if (!data) {
		return [];
	}

	const tasks = Object.entries(data).map(([taskId, taskData]) => {
		return new Task(taskId, taskData);
	});

	return tasks.filter((task) => task.getProjectId() === projectId);
}

/**
 * Creates a new task.
 *
 * @param payload - The data for the task to create.
 * @returns The created task.
 * @throws An error if the API request fails or the task ID is missing.
 */
export async function addTask(payload: TaskData): Promise<Task> {
	const url = `${BASE_URL}/tasks.json`;

	const options: RequestInit = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	};

	const data = await request<{ name: string }>(url, options);

	const taskId = data.name;

	if (!taskId) {
		throw new Error("Failed to create task: Missing task ID.");
	}

	return new Task(taskId, payload);
}

/**
 * Delete a task.
 *
 * @param taskId - The ID of the task to delete.
 * @throws An error if the API request fails.
 */
export async function deleteTask(taskId: string): Promise<void> {
	const url = `${BASE_URL}/tasks/${taskId}.json`;

	const options: RequestInit = {
		method: "DELETE",
	};

	await request(url, options);
}

/**
 * Updates an existing task.
 *
 * @param taskId - the ID of the task to update.
 * @param payload - The task data to update.
 * @throws An error if the API request fails.
 */
export async function updateTask(taskId: string, payload: Partial<TaskData>): Promise<void> {
	const url = `${BASE_URL}/tasks/${taskId}.json`;

	const options: RequestInit = {
		method: "PATCH",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	};

	await request<Partial<TaskData>>(url, options);
}
