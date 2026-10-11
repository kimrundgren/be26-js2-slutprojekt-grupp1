import "bootstrap";

import { getProjectId } from "./utils/urls";

import { renderProjectList } from "./features/projects/projectList";
import { renderProjectSummary } from "./features/projects/projectSummary";

import { renderMemberList } from "./features/members/memberList";

import { setupAddTaskForm } from "./features/tasks/addTaskForm";
import { setupEditTaskForm } from "./features/tasks/editTaskForm";
import { setupTaskBoard } from "./features/tasks/taskBoard";
import { renderTaskBoard } from "./features/tasks/taskBoard";
import { createProjectForm } from "./features/projects/projectForm";

function initApp(): void {
	const page = document.body.dataset.page;

	// Index, översiktsvy
	if (page === "index") {
		renderProjectList();
		renderMemberList();
		createProjectForm();
	}

	// Projektvy
	if (page === "project") {
		const projectId = getProjectId();

		if (!projectId) {
			window.location.href = "index.html";
			return;
		}

		setupTaskBoard();
		setupAddTaskForm();
		setupEditTaskForm();

		renderProjectSummary(projectId);
		renderTaskBoard(projectId);
	}
}

initApp();
