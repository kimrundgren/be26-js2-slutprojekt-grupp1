import { PRIORITY_LABELS, CATEGORY_LABELS, DATE_FORMAT } from "../../constants";

import { formatDate } from "../../utils/date";

import type { Task } from "../../models/Task";
import type { TaskStatus, Priority } from "../../types/types";

type TaskAction = "assign" | "edit" | "complete" | "delete";

const actionsByStatus: Record<TaskStatus, TaskAction[]> = {
	new: ["assign", "edit"],
	ongoing: ["complete", "edit"],
	done: ["delete"],
};

const actionLabels: Record<TaskAction, string> = {
	assign: "→ Tilldela",
	edit: "✎ Ändra",
	complete: "✓ Slutför",
	delete: "× Radera",
};

const actionClasses: Record<TaskAction, string> = {
	assign: "btn-outline-primary",
	edit: "btn-outline-dark",
	complete: "btn-outline-success",
	delete: "btn-outline-danger",
};

const priorityClasses: Record<Priority, string> = {
	low: "bg-success text-white",
	medium: "bg-warning text-dark",
	high: "bg-danger text-white",
};

// Skapar badges för kategori och prioritet
function createBadges(task: Task): HTMLDivElement {
	const badges = document.createElement("div");
	badges.className = "d-flex gap-2 mb-3";

	const category = task.getCategory();
	const priority = task.getPriority();

	const categoryBadge = document.createElement("span");
	categoryBadge.className = "badge bg-body-secondary text-body fw-normal";
	categoryBadge.textContent = CATEGORY_LABELS[category];

	const priorityBadge = document.createElement("span");
	priorityBadge.className = `badge fw-normal ${priorityClasses[priority]}`;
	priorityBadge.textContent = PRIORITY_LABELS[priority] + " prioritet";

	badges.append(categoryBadge, priorityBadge);

	return badges;
}

// Skapar tillgängliga action-knappar baserat på uppgiftens status
function createActionButtons(task: Task): HTMLDivElement {
	const actions = document.createElement("div");
	actions.className = "d-flex gap-2 mt-3";

	const status = task.getStatus();
	const taskActions = actionsByStatus[status];

	for (const action of taskActions) {
		const button = document.createElement("button");
		button.className = `btn btn-sm ${actionClasses[action]}`;
		button.textContent = actionLabels[action];
		button.dataset.action = action;

		actions.append(button);
	}

	return actions;
}

// Bygger ett uppgiftskort med information och tillgängliga actions
export function createTaskCard(task: Task): HTMLDivElement {
	const card = document.createElement("div");
	card.className = "card mb-2";
	card.dataset.taskId = task.getId();

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const status = task.getStatus();

	const title = document.createElement("h3");
	title.className = "h6 fw-bold";
	title.textContent = task.getTitle();

	const description = document.createElement("p");
	description.className = "small text-body-secondary";
	description.textContent = task.getDescription();

	const badges = createBadges(task);
	const actions = createActionButtons(task);

	const created = document.createElement("div");
	created.className = "small text-body-secondary";
	created.textContent = `Skapad: ${formatDate(task.getCreated(), DATE_FORMAT)}`;

	const completed = task.getCompleted();

	if (status === "done" && completed) {
		created.textContent += ` · Slutförd: ${formatDate(completed, DATE_FORMAT)}`;
	}

	const deadline = document.createElement("div");
	deadline.className = "small text-body-secondary";
	deadline.textContent = "Deadline: " + formatDate(task.getDeadline(), DATE_FORMAT);

	const assignedMember = document.createElement("div");
	assignedMember.className = "small text-body-secondary";

	// TODO: hämta medlemslistan en gång, inte separat för varje kort. Plocka ut namn (Therese)
	if (status !== "new") {
		assignedMember.textContent = "Tilldelad: " + "{Förnamn Efternamn}";
	}

	cardBody.append(badges, title, description, assignedMember, created, deadline, actions);
	card.append(cardBody);

	return card;
}
