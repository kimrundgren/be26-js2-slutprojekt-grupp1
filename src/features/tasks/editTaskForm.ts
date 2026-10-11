import { Modal } from "bootstrap";

import { PRIORITIES, PRIORITY_LABELS } from "../../constants";

import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { updateTask } from "../../services/taskService";
import { createSelectOption } from "../../utils/dom";

import type { Task } from "../../models/Task";
import type { Priority, TaskData } from "../../types/types";

import { updateTaskOnBoard } from "./taskBoard";

// Initierar formuläret och dess händelsehantering
export function setupEditTaskForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#edit-task-modal");
	const form = document.querySelector<HTMLFormElement>("#edit-task-form");
	const formError = document.querySelector<HTMLParagraphElement>("#form-error");
	const prioritySelect = document.querySelector<HTMLSelectElement>("#edit-task-priority");

	if (!modal || !form || !formError || !prioritySelect) {
		console.error("setupEditTaskForm: saknar element i HTML");
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

// Visar uppgiftens sparade värden i formuläret och öppnar modalen
export function handleEditTask(task: Task): void {
	const form = document.querySelector<HTMLFormElement>("#edit-task-form");
	const formError = document.querySelector("#form-error") as HTMLParagraphElement;

	if (!form || !formError) return;

	clearFormError(formError);

	const taskIdInput = form.querySelector<HTMLInputElement>("#edit-task-id");
	const prioritySelect = form.querySelector<HTMLSelectElement>("#edit-task-priority");
	const deadlineInput = form.querySelector<HTMLInputElement>("#edit-task-deadline");

	if (!prioritySelect || !deadlineInput || !taskIdInput) return;

	taskIdInput.value = task.getId();
	prioritySelect.value = task.getPriority();
	deadlineInput.value = task.getDeadline();

	Modal.getOrCreateInstance("#edit-task-modal").show();
}

// Hanterar validering och uppdatering av en befintlig uppgift
async function handleUpdateTaskSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	const form = event.currentTarget as HTMLFormElement;
	const formData = new FormData(form);
	const formError = form.querySelector("#form-error") as HTMLParagraphElement;

	clearFormError(formError);

	const taskId = formData.get("id") as string;
	const priority = formData.get("priority") as Priority;
	const deadline = formData.get("deadline") as string;

	const today = new Date().toLocaleDateString("sv-SE");

	if (!deadline || deadline < today) {
		renderFormError(formError, "Deadline får inte vara tidigare än idag.");
		return;
	}

	const taskUpdates: Partial<TaskData> = { priority, deadline };

	try {
		await updateTask(taskId, taskUpdates);
		updateTaskOnBoard(taskId, taskUpdates);

		renderNotice("Uppgiften har uppdaterats.", "success");

		Modal.getOrCreateInstance("#edit-task-modal").hide();
	} catch (error) {
		renderFormError(formError, "Kunde inte uppdatera uppgiften.");
		console.error("Kunde inte uppdatera uppgiften:", error);
	}
}
