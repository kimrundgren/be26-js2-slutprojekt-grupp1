import type { Member } from "../../models/Member";
import { getAllMembers } from "../../services/memberService";
import { getAllProjects } from "../../services/projectService";
import { getTasksByProject } from "../../services/taskService";
import { createMemberCard } from "./memberCard";

async function getOngoingTaskCount(member: Member): Promise<number> {
	const taskLists = await Promise.all(
		member.getProjectIds().map((projectId) => getTasksByProject(projectId)),
	);

	return taskLists
		.flat()
		.filter(
			(task) =>
				task.getAssignedMemberId() === member.getId() &&
				task.getStatus() === "ongoing",
		).length;
}

export async function renderMemberList(): Promise<void> {
	const container = document.getElementById("member-list");
	if (!container) return;

	const [members, projects] = await Promise.all([
		getAllMembers(),
		getAllProjects(),
	]);

	const cards = await Promise.all(
		members.map(async (member) => {
			const projectNames = member
				.getProjectIds()
				.map(
					(id) => projects.find((project) => project.getId() === id)?.getName(),
				)
				.filter((name): name is string => Boolean(name));

			const ongoingCount = await getOngoingTaskCount(member);

			return createMemberCard(member, projectNames, ongoingCount);
		}),
	);

	container.replaceChildren(...cards);
}
