import type { Member } from "../../models/Member";
import type { Project } from "../../models/Project";
import { getAllMembers } from "../../services/memberService";
import { getAllProjects } from "../../services/projectService";
import { getTasksByProject } from "../../services/taskService";
import { renderNotice } from "../../components/notice";
import { createMemberCard } from "./memberCard";

// Cached in module scope so addMemberToList can update the UI without refetching everything from Firebase
let members: Member[] = [];
let projects: Project[] = [];

async function getOngoingTaskCount(member: Member): Promise<number> {
	const taskLists = await Promise.all(
		member.getProjectIds().map((projectId) => getTasksByProject(projectId)),
	);

	return taskLists
		.flat()
		.filter(
			(task) => task.getAssignedMember() === member.getId() && task.getStatus() === "ongoing",
		).length;
}

async function buildMemberList(): Promise<void> {
	const container = document.getElementById("member-list");
	if (!container) return;

	if (members.length === 0) {
		container.textContent = "Inga medlemmar än";
		return;
	}

	const cards = await Promise.all(
		members.map(async (member) => {
			const projectNames = member
				.getProjectIds()
				.map((id) => projects.find((project) => project.getId() === id)?.getName())
				.filter((name): name is string => Boolean(name));

			const ongoingCount = await getOngoingTaskCount(member);

			return createMemberCard(member, projectNames, ongoingCount);
		}),
	);

	container.replaceChildren(...cards);
}

export async function renderMemberList(): Promise<void> {
	try {
		[members, projects] = await Promise.all([getAllMembers(), getAllProjects()]);
		await buildMemberList();
	} catch (error) {
		renderNotice("Det gick inte att hämta medlemmarna. Försök igen senare.", "error");
		console.error("Kunde inte hämta medlemmarna:", error);
	}
}

export async function addMemberToList(member: Member): Promise<void> {
	members.push(member);
	await buildMemberList();
}
