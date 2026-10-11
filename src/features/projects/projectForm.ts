import { addProject } from "../../services/projectService";
import { getAllMembers } from "../../services/memberService";
import { addProjectToList } from "./projectList";

export async function createProjectForm(): Promise<void> {
	const openButton = document.querySelector<HTMLButtonElement>("#new-project-button");

	if (!openButton) return;

	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "newProjectModal";

	modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title fs-5">Skapa nytt projekt</h2>
                    <button type="button" class="btn-close"
                        data-bs-dismiss="modal" aria-label="Stäng">
                    </button>
                </div>

                <form id="new-project-form">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="project-name" class="form-label">
                                Projektnamn
                            </label>
                            <input id="project-name" name="name"
                                class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label for="project-description" class="form-label">
                                Beskrivning
                            </label>
                            <textarea id="project-description" name="description"
                                class="form-control" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="project-deadline" class="form-label">
                                Deadline
                            </label>
                            <input id="project-deadline" name="deadline"
                                type="date" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label for="project-members" class="form-label">
                                Välj medlemmar
                            </label>
                            <select id="project-members" name="memberIds"
                                class="form-select" multiple>
                            </select>
                        </div>

                        <p id="project-error" class="text-danger" role="alert"></p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" id="cancel-project"
                            class="btn btn-secondary" data-bs-dismiss="modal">
                            Avbryt
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Skapa projekt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

	document.body.append(modal);

	// Bootstrap som gör att knappen öppnar modalen utan eget klickevent
	openButton.setAttribute("data-bs-toggle", "modal");
	openButton.setAttribute("data-bs-target", "#newProjectModal");

	const form = modal.querySelector<HTMLFormElement>("#new-project-form")!;
	const memberSelect = modal.querySelector<HTMLSelectElement>("#project-members")!;
	const errorMessage = modal.querySelector<HTMLParagraphElement>("#project-error")!;
	const cancelButton = modal.querySelector<HTMLButtonElement>("#cancel-project")!;
	const nameInput = modal.querySelector<HTMLInputElement>("#project-name")!;
	const descriptionInput = modal.querySelector<HTMLTextAreaElement>("#project-description")!;
	const deadlineInput = modal.querySelector<HTMLInputElement>("#project-deadline")!;

	try {
		const members = await getAllMembers();

		for (const member of members) {
			const option = document.createElement("option");
			option.value = member.getId();
			option.textContent = member.getName();
			memberSelect.append(option);
		}
	} catch (error) {
		errorMessage.textContent = "Kunde inte hämta medlemmarna.";
		console.error(error);
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		errorMessage.textContent = "";

		const name = nameInput.value.trim();
		const description = descriptionInput.value.trim();
		const deadline = deadlineInput.value;

		if (!name || !description || !deadline) {
			errorMessage.textContent = "Fyll i alla obligatoriska fält.";
			return;
		}

		// Går igenom de medlemmar som är markerade i select och sparar deras id
		const memberIds: string[] = [];
		for (const option of memberSelect.selectedOptions) {
			memberIds.push(option.value);
		}

		try {
			// Sparar i firebase, får tillbaka ett Project med riktigt id
			const project = await addProject(name, description, deadline, memberIds);

			// Visar det nya projektet direkt, tömmer formuläret och stänger modalen
			// cancelButton.click stänger modalen via data-bs-dismiss
			addProjectToList(project);
			form.reset();
			cancelButton.click();
		} catch (error) {
			errorMessage.textContent = "Projektet kunde inte sparas";
			console.error(error);
		}
	});
}
