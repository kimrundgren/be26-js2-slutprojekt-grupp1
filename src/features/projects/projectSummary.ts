import { getProjectId } from "../../services/projectService.ts";
import { Project } from "../../models/Project.ts";
import { getAllMembers } from "../../services/memberService.ts";

export async function createProjectSummary(project: Project): Promise<HTMLElement> {
	const section = document.createElement("section");
	section.className = "card mb-5";

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const title = document.createElement("h1");
	title.className = "h4";
	title.textContent = project.getName();

	const description = document.createElement("p");
	description.className = "text-muted";
	description.textContent = `${project.getDescription()} Deadline ${project.getDeadline()}`;

	const membersContainer = document.createElement("div");
	membersContainer.className = "d-flex flex-wrap gap-2";

	// Projektet har bara id på medlemmarna, så måste hämta alla medlemmar för att få namnen
	const memberIds = project.getMemberIds();

	if (memberIds.length === 0) {
		membersContainer.textContent = "Inga medlemmar";
	} else {
		const members = await getAllMembers();
		console.log(project);

		for (const memberId of memberIds) {
			const member = members.find((member) => member.getId() === memberId);

			if (!member) continue;

			const badge = document.createElement("span");
			badge.className = "badge bg-body-secondary text-body fw-normal";
			badge.textContent = member.getName();
			membersContainer.appendChild(badge);
		}
	}
	cardBody.append(title, description, membersContainer);
	section.appendChild(cardBody);

	return section;
}

// Hämtar projektet med id från urlen och byggar upp det i project summary
export async function renderProjectSummary(projectId: string): Promise<void> {
	const container = document.querySelector("#project-summary");

	if (!container) {
		return;
	}
	const project = await getProjectId(projectId);

	if (!project) {
		container.textContent = "Projektet kunde inte hittas";
		return;
	}
	const summary = await createProjectSummary(project);
	container.replaceChildren();
	container.appendChild(summary);
}
