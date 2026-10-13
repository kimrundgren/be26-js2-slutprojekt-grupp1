import { createProjectCard } from "./projectCard";
import { getAllProjects } from "../../services/projectService";
import { Project } from "../../models/Project";
import { getTasksByProject } from "../../services/taskService";
import { renderNotice } from "../../components/notice";

let projects: Project[] = [];
//Kopplar projektets id till antal pågående uppgifter
let ongoingCounts: Record<string, number> = {};

export function buildProjectList() {
	const container = document.querySelector("#project-list");

	if (!container) {
		return;
	}
	container.replaceChildren();

	if (projects.length === 0) {
		container.textContent = "Inga projekt än";
		return;
	}
	for (const project of projects) {
		const ongoingCount = ongoingCounts[project.getId()] ?? 0;
		const card = createProjectCard(project, ongoingCount);

		card.addEventListener("click", function () {
			window.location.href = `project.html?id=${project.getId()}`;
		});
		container.appendChild(card);
	}
}
// Hämtar projekten från firebase och bygger ut dem, körs när index laddas
export async function renderProjectList(): Promise<void> {
	try {
		projects = await getAllProjects();
		ongoingCounts = await getOngoingCounts(projects);
		buildProjectList();
	} catch (error) {
		renderNotice("Det gick inte att hämta projekten. Försök igen senare.", "error");
		console.error("Kunde inte hämta projekten:", error);
	}
}

// Används av formuläret, lägger till det nya projektet och bygger om.
export function addProjectToList(project: Project): void {
	projects.push(project);
	buildProjectList();
}

// Räknar pågående uppgifter för ett projekt
async function getOngoingCount(project: Project): Promise<number> {
	const tasks = await getTasksByProject(project.getId());

	const ongoingTasks = tasks.filter(function (task) {
		return task.getStatus() === "ongoing";
	});

	return ongoingTasks.length;
}

// Räknar pågående uppgifter för alla projekt
async function getOngoingCounts(projects: Project[]): Promise<Record<string, number>> {
	const counts: Record<string, number> = {};

	//Map startar en hämtning per projekt och alla körs samtidigt
	//Därför behövs promise.all, för det gör så att hämtningarna väntar tills alla är klara innan koden körs vidare
	await Promise.all(
		projects.map(async function (project) {
			counts[project.getId()] = await getOngoingCount(project);
		}),
	);
	return counts;
}
