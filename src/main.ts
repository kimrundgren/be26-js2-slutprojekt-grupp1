import "bootstrap";

import { getProjectId } from "./utils/urls";

import { renderProjectList } from "./features/projects/projectList";
import { renderProjectSummary } from "./features/projects/projectSummary";
import { setupProjectForm } from "./features/projects/projectForm";

import { renderMemberList } from "./features/members/memberList";
import { setupMemberForm } from "./features/members/memberForm";

import { setupAddTaskForm } from "./features/tasks/addTaskForm";
import { setupAssignForm } from "./features/tasks/assignTaskForm";
import { setupEditTaskForm } from "./features/tasks/editTaskForm";
import { renderTaskBoard, setupTaskBoard } from "./features/tasks/taskBoard";

/**
 * Initialize the application based on the current page.
 */
function initApp(): void {
	const page = document.body.dataset.page;

	if (!page) {
		throw new Error("initApp: Missing data-page attribute on body.");
	}

	if (page !== "index" && page !== "project") {
		throw new Error(`initApp: Unknown page "${page}".`);
	}

	// Initialize the overview page
	if (page === "index") {
		renderProjectList();
		renderMemberList();
		setupMemberForm();
		setupProjectForm();
	}

	// Initialize the project page
	if (page === "project") {
		const projectId = getProjectId();

		if (!projectId) {
			window.location.href = "index.html";
			return;
		}

		setupTaskBoard();
		setupAddTaskForm();
		setupEditTaskForm();
		setupAssignForm();

		renderProjectSummary(projectId);
		renderTaskBoard(projectId);
	}
}

initApp();
