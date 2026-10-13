import { Modal } from "bootstrap";
import { addProject } from "../../services/projectService";
import { getAllMembers, updateMember } from "../../services/memberService";
import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { createSelectOption } from "../../utils/dom";
import { addProjectToList } from "./projectList";

export async function setupProjectForm(): Promise<void> {
	const modal = document.querySelector<HTMLDivElement>("#new-project-modal");
	const form = document.querySelector<HTMLFormElement>("#new-project-form");
	const nameInput = document.querySelector<HTMLInputElement>("#project-name");
	const descriptionInput = document.querySelector<HTMLTextAreaElement>("#project-description");
	const deadlineInput = document.querySelector<HTMLInputElement>("#project-deadline");
	const memberSelect = document.querySelector<HTMLSelectElement>("#project-members");
	const formError = document.querySelector<HTMLParagraphElement>("#project-error");

	if (
		!modal ||
		!form ||
		!nameInput ||
		!descriptionInput ||
		!deadlineInput ||
		!memberSelect ||
		!formError
	) {
		console.error("setupProjectForm: saknar element i HTML");
		return;
	}

	// Tömmer formulär när modalen stängs
	modal.addEventListener("hidden.bs.modal", function () {
		form.reset();
		clearFormError(formError);
	});

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
		clearFormError(formError);

		const name = nameInput.value.trim();
		const description = descriptionInput.value.trim();
		const deadline = deadlineInput.value;

		if (!name || !description || !deadline) {
			renderFormError(formError, "Fyll i alla obligatoriska fält.");
			return;
		}

		try {
			const memberIds = getSelectedMemberIds(memberSelect);
			const project = await addProject(name, description, deadline, memberIds);
			await addProjectToMembers(project.getId(), memberIds);

			addProjectToList(project);
			renderNotice("Projektet har lagts till.", "success");
			Modal.getOrCreateInstance(modal).hide();
		} catch (error) {
			renderFormError(formError, "Projektet kunde inte sparas.");
			console.error(error);
		}
	});

	await fillMemberSelect(memberSelect, formError);
}

// Hämtar medlemmarna från firebase och gör att man kan välja dem i select
async function fillMemberSelect(
	memberSelect: HTMLSelectElement,
	formError: HTMLParagraphElement,
): Promise<void> {
	try {
		const members = await getAllMembers();

		for (const member of members) {
			memberSelect.append(createSelectOption(member.getName(), member.getId()));
		}
	} catch (error) {
		renderFormError(formError, "Kunde inte hämta medlemmarna.");
		console.error(error);
	}
}

// Går igenom medlemmarna som är markerade och sparar deras id
function getSelectedMemberIds(memberSelect: HTMLSelectElement): string[] {
	const memberIds: string[] = [];

	for (const option of memberSelect.selectedOptions) {
		memberIds.push(option.value);
	}
	return memberIds;
}
// Lägger till projektets id i projectIds hos varje vald medlem
async function addProjectToMembers(projectId: string, memberIds: string[]): Promise<void> {
	const members = await getAllMembers();
	const selectedMembers = members.filter((member) => memberIds.includes(member.getId()));

	await Promise.all(
		selectedMembers.map((member) =>
			updateMember(member.getId(), {
				projectIds: [...member.getProjectIds(), projectId],
			}),
		),
	);
}
