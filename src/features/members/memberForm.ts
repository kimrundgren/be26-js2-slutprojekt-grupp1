import { Modal } from "bootstrap";
import { CATEGORIES, CATEGORY_LABELS } from "../../constants";
import { renderNotice } from "../../components/notice";
import { renderFormError, clearFormError } from "../../components/formError";
import { addMember } from "../../services/memberService";
import { createSelectOption } from "../../utils/dom";
import type { Category } from "../../types/types";
import { addMemberToList } from "./memberList";

export function createMemberForm(): void {
	const modal = document.querySelector<HTMLDivElement>("#new-member-modal");
	const form = document.querySelector<HTMLFormElement>("#new-member-form");
	const nameInput = document.querySelector<HTMLInputElement>("#member-name");
	const categorySelect = document.querySelector<HTMLSelectElement>("#member-category");
	const formError = document.querySelector<HTMLParagraphElement>("#member-error");

	if (!modal || !form || !nameInput || !categorySelect || !formError) {
		console.error("createMemberForm: saknar element i HTML");
		return;
	}

	for (const category of CATEGORIES) {
		categorySelect.append(createSelectOption(CATEGORY_LABELS[category], category));
	}

	modal.addEventListener("hidden.bs.modal", () => {
		form.reset();
		clearFormError(formError);
	});

	form.addEventListener("submit", async function (event) {
		event.preventDefault();
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
			Modal.getOrCreateInstance(modal).hide();
		} catch (error) {
			renderFormError(formError, "Medlemmen kunde inte sparas.");
			console.error(error);
		}
	});
}
