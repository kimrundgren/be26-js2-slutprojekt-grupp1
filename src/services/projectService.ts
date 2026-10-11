import { BASE_URL } from "../constants";
import { Project } from "../models/Project";
import type { ProjectData } from "../types/types";
import { request } from "./api";

const urlProject = `${BASE_URL}/projects.json`;

export async function getAllProjects(): Promise<Project[]> {
	// typen Record beskriver svaret från firebase, alltså ett objekt med id(string) som nyckel och projectdata som värde
	const data = await request<Record<string, ProjectData> | null>(urlProject);

	if (!data) return [];

	// Map skapar ett projekt för varje par, Så att id:t följer med i objektet
	// om membersIds saknas används en ny [], för att firebase inte sparar tomma listor
	const projects: Project[] = Object.entries(data).map(
		([id, projectData]) => new Project(id, projectData),
	);
	return projects;
}

export async function addProject(
	name: string,
	description: string,
	deadline: string,
	memberIds: string[],
): Promise<Project> {
	const result = await request<{ name: string }>(urlProject, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, description, deadline, memberIds }),
	});
	return new Project(result.name, { name, description, deadline, memberIds });
}

export async function getProjectId(id: string): Promise<Project | null> {
	const url = `${BASE_URL}/projects/${id}.json`;

	const data = await request<ProjectData | null>(url);
	if (!data) return null;

	return new Project(id, data);
}
