import { BASE_URL } from "../constants";
import { Project } from "../models/Project";
import type { ProjectData } from "../types/types";
import { request } from "./api";

const urlProject = `${BASE_URL}/projects.json`;

export async function getAllProjects(): Promise<Project[]> {
	const data = await request<Record<string, ProjectData> | null>(urlProject);

	if (!data) return [];

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

// Gets one project by its id. Returns null if it doesn't exist
export async function getProjectById(id: string): Promise<Project | null> {
	const url = `${BASE_URL}/projects/${id}.json`;

	const data = await request<ProjectData | null>(url);
	if (!data) return null;

	return new Project(id, data);
}
