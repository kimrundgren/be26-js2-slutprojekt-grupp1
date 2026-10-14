import { Modal } from "bootstrap";
import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { getAllMembers } from "../../services/memberService";
import { updateTask } from "../../services/taskService";
import { createSelectOption } from "../../utils/dom";
import type { Task } from "../../models/Task";
import type { TaskData } from "../../types/types";
import { updateTaskOnBoard } from "./taskBoard";

export function setupAssignForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#assign-task-modal");
	const form = document.querySelector<HTMLFormElement>("#assign-task-form");
	const formError = document.querySelector<HTMLParagraphElement>("#form-error");
	const memberSelect = document.querySelector<HTMLSelectElement>("#assign-task-member");

	if (!modal || !form || !formError || !memberSelect) {
		console.error("setupAssignForm: saknar element i HTML");
		return;
	}

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		clearFormError(formError);
	});

	form.addEventListener("submit", handleAssignTaskSubmit);
}

export async function handleAssignTask(task: Task): Promise<void> {
	const form = document.querySelector<HTMLFormElement>("#assign-task-form");
	const formError = form?.querySelector<HTMLParagraphElement>("#form-error");
	const taskIdInput = form?.querySelector<HTMLInputElement>("#assign-task-id");
	const memberSelect = form?.querySelector<HTMLSelectElement>("#assign-task-member");

	if (!form || !formError || !taskIdInput || !memberSelect) return;

	clearFormError(formError);

	taskIdInput.value = task.getId();

	memberSelect.replaceChildren(new Option("Välj medlem...", "", true, true));
	memberSelect.options[0].disabled = true;

	try {
		const members = await getAllMembers();
		const matchingMembers = members.filter(
			(member) =>
				member.getCategory() === task.getCategory() &&
				member.getProjectIds().includes(task.getProjectId()),
		);

		if (matchingMembers.length === 0) {
			renderNotice("Det finns ingen medlem med matchande kategori att tilldela.", "error");
			return;
		}

		for (const member of matchingMembers) {
			const option = createSelectOption(member.getName(), member.getId());
			memberSelect.append(option);
		}
	} catch (error) {
		renderFormError(formError, "Kunde inte hämta medlemmarna.");

		if (error instanceof Error) {
			console.error("Kunde inte hämta medlemmarna:", error.message);
		} else {
			console.error("Kunde inte hämta medlemmarna, okänt fel:", error);
		}
		return;
	}

	Modal.getOrCreateInstance("#assign-task-modal").show();
}

async function handleAssignTaskSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	const form = event.currentTarget as HTMLFormElement;
	const formData = new FormData(form);
	const formError = form.querySelector<HTMLParagraphElement>("#form-error");

	if (!formError) return;

	clearFormError(formError);

	const taskId = formData.get("id") as string;
	const memberId = formData.get("memberId") as string;

	if (!memberId) {
		renderFormError(formError, "Välj en medlem att tilldela.");
		return;
	}

	const taskUpdates: Partial<TaskData> = { memberId, status: "ongoing" };

	try {
		await updateTask(taskId, taskUpdates);
		updateTaskOnBoard(taskId, taskUpdates);

		renderNotice("Uppgiften har tilldelats.", "success");

		Modal.getOrCreateInstance("#assign-task-modal").hide();
	} catch (error) {
		renderFormError(formError, "Kunde inte tilldela uppgiften.");

		if (error instanceof Error) {
			console.error("Kunde inte tilldela uppgiften:", error.message);
		} else {
			console.error("Kunde inte tilldela uppgiften, okänt fel:", error);
		}
	}
}
