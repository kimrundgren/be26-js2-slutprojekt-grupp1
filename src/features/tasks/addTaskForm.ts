import { Modal } from "bootstrap";

import { CATEGORIES, PRIORITIES, PRIORITY_LABELS, CATEGORY_LABELS } from "../../constants";

import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { addTask } from "../../services/taskService";
import { createSelectOption } from "../../utils/dom";
import { getProjectId } from "../../utils/urls";

import type { Category, Priority, TaskData } from "../../types/types";

import { addTaskToBoard } from "./taskBoard";

// Initierar formuläret och dess händelsehantering
export function setupAddTaskForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#add-task-modal");
	const form = document.querySelector<HTMLFormElement>("#add-task-form");
	const formError = document.querySelector<HTMLParagraphElement>("#form-error");

	const categorySelect = document.querySelector<HTMLSelectElement>("#add-task-category");
	const prioritySelect = document.querySelector<HTMLSelectElement>("#add-task-priority");

	if (!modal || !form || !formError || !categorySelect || !prioritySelect) {
		console.error("setupAddTaskForm: saknar element i HTML");
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

// Hanterar validering och skapande av en ny uppgift vid submit
async function handleAddTaskSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	const form = event.currentTarget as HTMLFormElement;
	const formData = new FormData(form);
	const formError = form.querySelector("#form-error") as HTMLParagraphElement;

	clearFormError(formError);

	const title = (formData.get("title") as string).trim();
	const description = (formData.get("description") as string).trim();
	const category = formData.get("category") as Category;
	const priority = formData.get("priority") as Priority;
	const deadline = formData.get("deadline") as string;

	const today = new Date().toLocaleDateString("sv-SE");

	if (!title || !description) {
		renderFormError(formError, "Titel och beskrivning får inte vara tomma.");
		return;
	}

	if (!deadline || deadline < today) {
		renderFormError(formError, "Deadline får inte vara tidigare än idag.");
		return;
	}

	const projectId = getProjectId();

	if (!projectId) {
		console.error("Projekt-ID saknas i URL:en");
		return;
	}

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

	try {
		const newTask = await addTask(taskData);
		addTaskToBoard(newTask);

		renderNotice("Uppgiften har lagts till.", "success");

		Modal.getOrCreateInstance("#add-task-modal").hide();
	} catch (error) {
		renderFormError(formError, "Kunde inte skapa uppgiften.");
		console.error("Kunde inte skapa uppgiften:", error);
	}
}
