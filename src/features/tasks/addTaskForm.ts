import { Modal } from "bootstrap";

import {
	CATEGORIES,
	CATEGORY_LABELS,
	DATE_FORMAT,
	PRIORITIES,
	PRIORITY_LABELS,
} from "../../constants";

import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { addTask } from "../../services/taskService";
import { createSelectOption } from "../../utils/dom";
import { getProjectId } from "../../utils/urls";
import { formatDate } from "../../utils/date";

import type { Task } from "../../models/Task";
import type { TaskData } from "../../types/types";

import { addTaskToBoard } from "./taskBoard";

/**
 * Sets up the add task form.
 */
export function setupAddTaskForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#add-task-modal");
	const form = document.querySelector<HTMLFormElement>("#add-task-form");
	const categorySelect = document.querySelector<HTMLSelectElement>("#add-task-category");
	const prioritySelect = document.querySelector<HTMLSelectElement>("#add-task-priority");

	if (!modal || !form || !categorySelect || !prioritySelect) {
		console.error("setupAddTaskForm: Required HTML elements are missing.");
		return;
	}

	const formError = form.querySelector<HTMLParagraphElement>("#form-error");

	if (!formError) {
		console.error("setupAddTaskForm: Form error element is missing.");
		return;
	}

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		clearFormError(formError);
	});

	for (const category of CATEGORIES) {
		const option = createSelectOption(CATEGORY_LABELS[category], category);
		categorySelect.append(option);
	}

	for (const priority of PRIORITIES) {
		const option = createSelectOption(PRIORITY_LABELS[priority], priority);
		prioritySelect.append(option);
	}

	form.addEventListener("submit", handleAddTaskSubmit);
}

/**
 * Handles add task form submission.
 *
 * @param event - The form submit event.
 */
async function handleAddTaskSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	if (!(event.currentTarget instanceof HTMLFormElement)) {
		console.error("handleAddTaskSubmit: Invalid form element.");
		return;
	}

	const form = event.currentTarget;
	const formError = form.querySelector<HTMLParagraphElement>("#form-error");

	if (!formError) {
		console.error("handleAddTaskSubmit: Form error element is missing.");
		return;
	}

	clearFormError(formError);

	const formData = new FormData(form);

	const titleValue = formData.get("title");
	const descriptionValue = formData.get("description");
	const categoryValue = formData.get("category");
	const priorityValue = formData.get("priority");
	const deadlineValue = formData.get("deadline");

	if (
		typeof titleValue !== "string" ||
		typeof descriptionValue !== "string" ||
		typeof categoryValue !== "string" ||
		typeof priorityValue !== "string" ||
		typeof deadlineValue !== "string"
	) {
		renderFormError(formError, "Alla fält måste fyllas i korrekt.");
		return;
	}

	const title = titleValue.trim();
	const description = descriptionValue.trim();
	const category = CATEGORIES.find((item) => item === categoryValue);
	const priority = PRIORITIES.find((item) => item === priorityValue);
	const deadline = deadlineValue;
	const today = formatDate(new Date(), DATE_FORMAT);

	if (!title || !description) {
		renderFormError(formError, "Titel och beskrivning får inte vara tomma.");
		return;
	}

	if (!category || !priority) {
		renderFormError(formError, "Välj en giltig kategori och prioritet.");
		return;
	}

	if (!deadline || deadline < today) {
		renderFormError(formError, "Deadline får inte vara tidigare än idag.");
		return;
	}

	const projectId = getProjectId();

	if (!projectId) {
		renderFormError(formError, "Projekt-ID saknas. Försök öppna projektet igen.");
		console.error("handleAddTaskSubmit: Missing project ID.");
		return;
	}

	// Prepare task data for the API
	const taskData: TaskData = {
		title,
		description,
		category,
		priority,
		deadline,
		status: "new",
		created: new Date().toISOString(),
		projectId,
	};

	let newTask: Task;

	try {
		newTask = await addTask(taskData);
	} catch (error) {
		renderFormError(formError, "Kunde inte skapa uppgiften.");

		if (error instanceof Error) {
			console.error("Failed to create task:", error.message);
		} else {
			console.error("Failed to create task:", error);
		}

		return;
	}

	addTaskToBoard(newTask);
	renderNotice("Uppgiften har lagts till.", "success");
	Modal.getOrCreateInstance("#add-task-modal").hide();
}
