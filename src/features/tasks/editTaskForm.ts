import { Modal } from "bootstrap";

import { DATE_FORMAT, PRIORITIES, PRIORITY_LABELS } from "../../constants";

import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { updateTask } from "../../services/taskService";
import { createSelectOption } from "../../utils/dom";
import { formatDate } from "../../utils/date";

import type { Task } from "../../models/Task";
import type { TaskData } from "../../types/types";

import { updateTaskOnBoard } from "./taskBoard";

/**
 * Sets up the edit task form.
 */
export function setupEditTaskForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#edit-task-modal");
	const form = document.querySelector<HTMLFormElement>("#edit-task-form");
	const prioritySelect = document.querySelector<HTMLSelectElement>("#edit-task-priority");

	if (!modal || !form || !prioritySelect) {
		console.error("setupEditTaskForm: Required HTML elements are missing.");
		return;
	}

	const formError = form.querySelector<HTMLParagraphElement>("#form-error");

	if (!formError) {
		console.error("setupEditTaskForm: Form error element is missing.");
		return;
	}

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		clearFormError(formError);
	});

	for (const priority of PRIORITIES) {
		const option = createSelectOption(PRIORITY_LABELS[priority], priority);
		prioritySelect.append(option);
	}

	form.addEventListener("submit", handleUpdateTaskSubmit);
}

/**
 * Populates the form with the selected task and opens the modal.
 *
 * @param task - The task to edit.
 */
export function handleEditTask(task: Task): void {
	const form = document.querySelector<HTMLFormElement>("#edit-task-form");

	if (!form) {
		console.error("handleEditTask: Form element is missing.");
		return;
	}

	const formError = form.querySelector<HTMLParagraphElement>("#form-error");
	const taskIdInput = form.querySelector<HTMLInputElement>("#edit-task-id");
	const prioritySelect = form.querySelector<HTMLSelectElement>("#edit-task-priority");
	const deadlineInput = form.querySelector<HTMLInputElement>("#edit-task-deadline");

	if (!formError || !taskIdInput || !prioritySelect || !deadlineInput) {
		console.error("handleEditTask: Required form elements are missing.");
		return;
	}

	clearFormError(formError);

	taskIdInput.value = task.getId();
	prioritySelect.value = task.getPriority();
	deadlineInput.value = task.getDeadline();

	Modal.getOrCreateInstance("#edit-task-modal").show();
}

/**
 * Handles edit task form submission.
 *
 * @param event - The form submit event.
 */
async function handleUpdateTaskSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	if (!(event.currentTarget instanceof HTMLFormElement)) {
		console.error("handleUpdateTaskSubmit: Invalid form element.");
		return;
	}

	const form = event.currentTarget;
	const formError = form.querySelector<HTMLParagraphElement>("#form-error");

	if (!formError) {
		console.error("handleUpdateTaskSubmit: Form error element is missing.");
		return;
	}

	clearFormError(formError);

	const formData = new FormData(form);

	const taskIdValue = formData.get("id");
	const priorityValue = formData.get("priority");
	const deadlineValue = formData.get("deadline");

	if (
		typeof taskIdValue !== "string" ||
		typeof priorityValue !== "string" ||
		typeof deadlineValue !== "string"
	) {
		renderFormError(formError, "Alla fält måste fyllas i korrekt.");
		return;
	}

	const taskId = taskIdValue;
	const priority = PRIORITIES.find((item) => item === priorityValue);
	const deadline = deadlineValue;
	const today = formatDate(new Date(), DATE_FORMAT);

	if (!priority) {
		renderFormError(formError, "Välj en giltig prioritet.");
		return;
	}

	if (!deadline || deadline < today) {
		renderFormError(formError, "Deadline får inte vara tidigare än idag.");
		return;
	}

	const taskUpdates: Partial<TaskData> = { priority, deadline };

	try {
		await updateTask(taskId, taskUpdates);
	} catch (error) {
		renderFormError(formError, "Kunde inte uppdatera uppgiften.");

		if (error instanceof Error) {
			console.error("Failed to update task:", error.message);
		} else {
			console.error("Failed to update task:", error);
		}

		return;
	}

	updateTaskOnBoard(taskId, taskUpdates);

	renderNotice("Uppgiften har uppdaterats.", "success");
	Modal.getOrCreateInstance("#edit-task-modal").hide();
}
