import { createProjectCard } from "./projectCard";
import { getAllProjects } from "../../services/projectService";
import { Project } from "../../models/Project";
import { getTasksByProject } from "../../services/taskService";
import { renderNotice } from "../../components/notice";

let projects: Project[] = [];
// Maps each project id to its number of ongoing tasks
let ongoingCounts: Record<string, number> = {};

// Draws a card for every project
export function renderProjectCards() {
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

		container.appendChild(card);
	}
}
// Gets the projects from firebase and shows them on the page. Runs when index.html loads
export async function renderProjectList(): Promise<void> {
	try {
		projects = await getAllProjects();
		ongoingCounts = await getOngoingCounts(projects);
		renderProjectCards();
	} catch (error) {
		renderNotice("Det gick inte att hämta projekten. Försök igen senare.", "error");
		console.error("Kunde inte hämta projekten:", error);
	}
}

// Adds the new project to the list, then draws all the cards again
export function addProjectToList(project: Project): void {
	projects.push(project);
	renderProjectCards();
}

// Counts ongoing tasks for one project
async function getOngoingCount(project: Project): Promise<number> {
	const tasks = await getTasksByProject(project.getId());

	const ongoingTasks = tasks.filter(function (task) {
		return task.getStatus() === "ongoing";
	});

	return ongoingTasks.length;
}

// Counts ongoing tasks for every project
async function getOngoingCounts(projects: Project[]): Promise<Record<string, number>> {
	const counts: Record<string, number> = {};

	await Promise.all(
		projects.map(async function (project) {
			counts[project.getId()] = await getOngoingCount(project);
		}),
	);
	return counts;
}
