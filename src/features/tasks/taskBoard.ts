import { renderNotice, clearNotice } from "../../components/notice";

import { getProjectById } from "../../services/projectService";
import { getTasksByProject, deleteTask, updateTask } from "../../services/taskService";
import { getAllMembers } from "../../services/memberService";

import { createTaskCard } from "./taskCard";
import { handleEditTask } from "./editTaskForm";
import { handleAssignTask } from "./assignTaskForm";
import {
	filterTasks,
	sortTasks,
	getFilterValues,
	setupTaskFilters,
	renderMemberFilter,
} from "./taskFilter";

import { clearElements } from "../../utils/dom";

import type { Task } from "../../models/Task";
import type { Member } from "../../models/Member";
import type { TaskData } from "../../types/types";

let tasks: Task[] = [];
let members: Member[] = [];

/**
 * Sets up the task board and registers event handlers.
 */
export function setupTaskBoard(): void {
	const taskBoard = document.querySelector<HTMLDivElement>("#task-board");

	if (!taskBoard) {
		console.error("setupTaskBoard: Could not find the task board element in the HTML.");
		return;
	}

	setupTaskFilters(renderTasks);
	taskBoard.addEventListener("click", handleTaskBoardClick);
}

/**
 * Handles button clicks on the task board using event delegation.
 *
 * @param event - The click event from the task board.
 */
function handleTaskBoardClick(event: MouseEvent): void {
	if (!(event.target instanceof Element)) return;

	const button = event.target.closest<HTMLButtonElement>("button[data-action]");
	const card = button?.closest<HTMLElement>("[data-task-id]");

	if (!button || !card) return;

	const taskId = card.dataset.taskId;

	if (!taskId) return;

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

	if (button.dataset.action === "assign") {
		const task = tasks.find((task) => task.getId() === taskId);

		if (!task) return;

		handleAssignTask(task);
	}
}

/**
 * Deletes a task and updates the task board.
 *
 * @param taskId - The ID of the task to delete.
 */
async function handleDeleteTask(taskId: string): Promise<void> {
	try {
		await deleteTask(taskId);

		tasks = tasks.filter((task) => task.getId() !== taskId);
		renderTasks();

		clearNotice();
		renderNotice("Uppgiften har tagits bort.", "success");
	} catch (error) {
		renderNotice("Kunde inte radera uppgiften.", "error");
		console.error("Failed to delete task:", error);
	}
}

/**
 * Marks a task as completed and updates the task board.
 *
 * @param taskId - The ID of the task to complete.
 */
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
		console.error("Failed to complete task:", error);
	}
}

/**
 * Fetches the project tasks and members, then renders the task board.
 *
 * @param projectId - The ID of the project.
 */
export async function renderTaskBoard(projectId: string): Promise<void> {
	try {
		const project = await getProjectById(projectId);

		if (!project) {
			renderNotice("Projektet kunde inte hittas.", "error");
			return;
		}

		[tasks, members] = await Promise.all([getTasksByProject(projectId), getAllMembers()]);

		const memberIds = project.getMemberIds() ?? [];
		const projectMembers = members.filter((member) => memberIds.includes(member.getId()));

		renderMemberFilter(projectMembers);
		renderTasks();
		clearNotice();
	} catch (error) {
		renderNotice("Det gick inte att hämta uppgifterna. Försök igen senare.", "error");
		console.error("Failed to load the task board:", error);
	}
}

/**
 * Renders the filtered and sorted tasks in their respective status columns.
 */
function renderTasks(): void {
	const newColumn = document.querySelector<HTMLDivElement>("#column-new");
	const ongoingColumn = document.querySelector<HTMLDivElement>("#column-ongoing");
	const doneColumn = document.querySelector<HTMLDivElement>("#column-done");

	if (!newColumn || !ongoingColumn || !doneColumn) {
		console.error("renderTasks: Could not find all task board columns in the HTML.");
		return;
	}

	const columns = {
		new: newColumn,
		ongoing: ongoingColumn,
		done: doneColumn,
	};

	clearElements([newColumn, ongoingColumn, doneColumn]);

	const { category, memberId, sort } = getFilterValues();
	const filteredTasks = filterTasks(tasks, category, memberId);
	const visibleTasks = sortTasks(filteredTasks, sort);

	for (const task of visibleTasks) {
		const card = createTaskCard(task, members);
		const column = columns[task.getStatus()];

		column.append(card);
	}
}

/**
 * Adds a task to the local state and re-renders the board.
 *
 * @param task - The task to add.
 */
export function addTaskToBoard(task: Task): void {
	tasks.push(task);
	renderTasks();
}

/**
 * Updates a task in the local state and re-renders the board.
 *
 * @param taskId - The ID of the task to update.
 * @param updates - The task properties to update.
 */
export function updateTaskOnBoard(taskId: string, updates: Partial<TaskData>): void {
	const task = tasks.find((task) => task.getId() === taskId);

	if (!task) return;

	if (updates.priority) task.setPriority(updates.priority);
	if (updates.deadline) task.setDeadline(updates.deadline);
	if (updates.status) task.setStatus(updates.status);
	if (updates.completed) task.setCompleted(updates.completed);
	if (updates.memberId) task.setAssignedMember(updates.memberId);

	renderTasks();
}
