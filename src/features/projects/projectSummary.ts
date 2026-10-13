import { getProjectById } from "../../services/projectService";
import { Project } from "../../models/Project";
import { getAllMembers } from "../../services/memberService";
import { formatDate } from "../../utils/date";
import { DATE_FORMAT, CATEGORY_LABELS } from "../../constants";
import { renderNotice } from "../../components/notice";
import { getTasksByProject } from "../../services/taskService";
import type { Member } from "../../models/Member";

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
	description.textContent = `${project.getDescription()} Deadline ${formatDate(project.getDeadline(), DATE_FORMAT)}`;

	const membersContainer = document.createElement("div");
	membersContainer.className = "d-flex flex-wrap gap-2";

	// Projektet har bara id på medlemmarna, så måste hämta alla medlemmar för att få namnen
	const memberIds = project.getMemberIds();

	if (memberIds.length === 0) {
		membersContainer.textContent = "Inga medlemmar";
	} else {
		const [members, tasks] = await Promise.all([
			getAllMembers(),
			getTasksByProject(project.getId()),
		]);

		for (const memberId of memberIds) {
			const member = members.find((member) => member.getId() === memberId);

			if (!member) continue;

			const ongoingCount = tasks.filter(function (task) {
				return (
					task.getAssignedMember() === member.getId() && task.getStatus() === "ongoing"
				);
			}).length;

			membersContainer.appendChild(createMemberBadge(member, ongoingCount));
		}
	}
	cardBody.append(title, description, membersContainer);
	section.appendChild(cardBody);

	return section;
}

// Hämtar projektet med id från urlen och bygger upp det i project summary
export async function renderProjectSummary(projectId: string): Promise<void> {
	const container = document.querySelector("#project-summary");

	if (!container) {
		return;
	}
	try {
		const project = await getProjectById(projectId);
		// Ingen krasch, men inget projekt med det id:t finns i databasen
		if (!project) {
			container.textContent = "Projektet kunde inte hittas";
			return;
		}
		const summary = await createProjectSummary(project);
		container.replaceChildren();
		container.appendChild(summary);
	} catch (error) {
		// Nätverksfel eller databasfel, visa något i stället för en tom ruta
		container.textContent = "Det gick inte att hämta projektet.";
		renderNotice("Det gick inte att hämta projektet. Försök igen senare.", "error");
		console.error("Kunde inte hämta projektet:", error);
	}
}

// Bygger en badge med namn, kategori och antal pågående uppgifter
function createMemberBadge(member: Member, ongoingCount: number): HTMLElement {
	const badge = document.createElement("span");
	badge.className = "badge bg-body-secondary text-body fw-normal";
	badge.textContent = `${member.getName()} • ${CATEGORY_LABELS[member.getCategory()]} • ${ongoingCount} pågående uppgifter`;

	return badge;
}
