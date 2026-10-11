import { renderNotice, clearNotice } from "../../components/notice";

import { getTasksByProject, deleteTask, updateTask } from "../../services/taskService";
import { createTaskCard } from "./taskCard";
import { handleEditTask } from "./editTaskForm";
import type { Task } from "../../models/Task";

import { clearElements } from "../../utils/dom";
import type { TaskData } from "../../types/types";

let tasks: Task[] = [];

// Kopplar klickhantering till boarden
export function setupTaskBoard(): void {
	const taskBoard = document.querySelector<HTMLDivElement>("#task-board");

	if (!taskBoard) {
		console.error("setupTaskBoard: saknar #task-board i HMTL");
		return;
	}

	taskBoard.addEventListener("click", handleTaskBoardClick);
}

// Hanterar actions från uppgiftskorten
function handleTaskBoardClick(event: MouseEvent): void {
	const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-action]");
	const card = button?.closest<HTMLElement>("[data-task-id]");

	if (!button || !card) return;

	const taskId = card.dataset.taskId as string;

	if (button.dataset.action === "delete") {
		handleDeleteTask(taskId);
	}

	if (button.dataset.action === "edit") {
		const task = tasks.find((task) => task.getId() === taskId);

		if (!task) return;

		handleEditTask(task);
	}

	if (button.dataset.action === "complete") {
		handleCompleteTask(taskId);
	}
}

// Raderar en uppgift och uppdaterar boarden
async function handleDeleteTask(taskId: string): Promise<void> {
	try {
		await deleteTask(taskId);

		tasks = tasks.filter((task) => task.getId() !== taskId);
		renderTasks();

		clearNotice();
		renderNotice("Uppgiften har tagits bort.", "success");
	} catch (error) {
		renderNotice("Kunde inte radera uppgiften.", "error");
		console.error("Kunde inte radera uppgiften.", error);
	}
}

// Slutför en uppgift och uppdaterar boarden
async function handleCompleteTask(taskId: string): Promise<void> {
	const taskUpdates: Partial<TaskData> = {
		status: "done",
		completed: new Date().toISOString(),
	};

	try {
		await updateTask(taskId, taskUpdates);
		updateTaskOnBoard(taskId, taskUpdates);

		renderNotice("Uppgiften är slutförd.", "success");
	} catch (error) {
		renderNotice("Kunde inte slutföra uppgiften.", "error");
		console.error("Kunde inte slutföra uppgiften.", error);
	}
}

// Hämtar projektets uppgifter och visar boarden
export async function renderTaskBoard(projectId: string): Promise<void> {
	try {
		tasks = await getTasksByProject(projectId);

		renderTasks();
		clearNotice();
	} catch (error) {
		renderNotice("Det gick inte att hämta uppgifterna. Försök igen senare.", "error");
		console.error("Kunde inte hämta uppgifterna:", error);
	}
}

// Renderar uppgifterna i respektive statuskolumn
function renderTasks(): void {
	const newColumn = document.querySelector<HTMLDivElement>("#column-new");
	const ongoingColumn = document.querySelector<HTMLDivElement>("#column-ongoing");
	const doneColumn = document.querySelector<HTMLDivElement>("#column-done");

	if (!newColumn || !ongoingColumn || !doneColumn) {
		console.error("Kunde inte hitta boardens kolumner.");
		return;
	}

	const columns = {
		new: newColumn,
		ongoing: ongoingColumn,
		done: doneColumn,
	};

	clearElements([newColumn, ongoingColumn, doneColumn]);

	for (const task of tasks) {
		const card = createTaskCard(task);
		const column = columns[task.getStatus()];

		column.append(card);
	}
}

// Lägger till en uppgift i boardens local state
export function addTaskToBoard(task: Task): void {
	tasks.push(task);
	renderTasks();
}

// Uppdaterar en befintlig uppgift i boardens local state
export function updateTaskOnBoard(taskId: string, updates: Partial<TaskData>): void {
	const task = tasks.find((task) => task.getId() === taskId);

	if (!task) return;

	if (updates.priority) task.setPriority(updates.priority);
	if (updates.deadline) task.setDeadline(updates.deadline);
	if (updates.status) task.setStatus(updates.status);
	if (updates.completed) task.setCompleted(updates.completed);

	renderTasks();
}
