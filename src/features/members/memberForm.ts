import { Modal } from "bootstrap";
import { CATEGORIES, CATEGORY_LABELS } from "../../constants";
import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { addMember } from "../../services/memberService";
import { createSelectOption } from "../../utils/dom";
import type { Category } from "../../types/types";
import { addMemberToList } from "./memberList";

export function setupMemberForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#new-member-modal");
	const form = document.querySelector<HTMLFormElement>("#new-member-form");
	const categorySelect = document.querySelector<HTMLSelectElement>("#member-category");
	const formError = document.querySelector<HTMLParagraphElement>("#member-error");

	if (!modal || !form || !categorySelect || !formError) {
		console.error("setupMemberForm: saknar element i HTML");
		return;
	}

	renderCategoryOptions(categorySelect);

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		clearFormError(formError);
	});

	form.addEventListener("submit", handleMemberSubmit);
}

function renderCategoryOptions(categorySelect: HTMLSelectElement): void {
	for (const category of CATEGORIES) {
		categorySelect.append(createSelectOption(CATEGORY_LABELS[category], category));
	}
}

// Re-query the form instead of closing over setupMemberForm's variables, so this handler stays standalone
async function handleMemberSubmit(event: SubmitEvent): Promise<void> {
	event.preventDefault();

	const form = event.currentTarget as HTMLFormElement;
	const nameInput = form.querySelector<HTMLInputElement>("#member-name");
	const categorySelect = form.querySelector<HTMLSelectElement>("#member-category");
	const formError = form.querySelector<HTMLParagraphElement>("#member-error");

	if (!nameInput || !categorySelect || !formError) return;

	clearFormError(formError);

	const name = nameInput.value.trim();
	const category = categorySelect.value as Category;

	if (!name || !category) {
		renderFormError(formError, "Fyll i alla obligatoriska fält.");
		return;
	}

	try {
		const member = await addMember(name, category);

		await addMemberToList(member);
		renderNotice("Medlemmen har lagts till.", "success");
		Modal.getOrCreateInstance("#new-member-modal").hide();
	} catch (error) {
		renderFormError(formError, "Medlemmen kunde inte sparas.");

		if (error instanceof Error) {
			console.error("Kunde inte spara medlemmen:", error.message);
		} else {
			console.error("Kunde inte spara medlemmen, okänt fel:", error);
		}
	}
}
