import type { Member } from "../../models/Member";
import type { Project } from "../../models/Project";
import { getAllMembers } from "../../services/memberService";
import { getAllProjects } from "../../services/projectService";
import { getTasksByProject } from "../../services/taskService";
import { createMemberCard } from "./memberCard";

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

// Hämtar medlemmarna och projekten från firebase och bygger ut listan, körs när index laddas
export async function renderMemberList(): Promise<void> {
	[members, projects] = await Promise.all([getAllMembers(), getAllProjects()]);
	await buildMemberList();
}

// Används av formuläret, lägger till den nya medlemmen och bygger om listan
export async function addMemberToList(member: Member): Promise<void> {
	members.push(member);
	await buildMemberList();
}
