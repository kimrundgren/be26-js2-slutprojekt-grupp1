import type { Task } from "../../models/Task";
import type { Member } from "../../models/Member";
import { createSelectOption } from "../../utils/dom";

// Filters the tasks on category and member
export function filterTasks(tasks: Task[], category: string, memberId: string): Task[] {
	return tasks.filter(function (task) {
		if (category !== "" && task.getCategory() !== category) {
			return false;
		}
		if (memberId !== "" && task.getAssignedMember() !== memberId) {
			return false;
		}

		return true;
	});
}
// Compares two tasks to see which one has the earliest deadline
function compareDeadline(firstTask: Task, secondTask: Task): number {
	return firstTask.getDeadline().localeCompare(secondTask.getDeadline());
}
// Same as above but for the title. "sv" makes å, ä and ö sort in the right order
function compareTitle(firstTask: Task, secondTask: Task): number {
	return firstTask.getTitle().localeCompare(secondTask.getTitle(), "sv");
}
// Sorts the tasks by what is chosen in the sort box
export function sortTasks(tasks: Task[], sort: string): Task[] {
	const sorted = [...tasks];

	if (sort.startsWith("deadline")) {
		sorted.sort(compareDeadline);
	}
	if (sort.startsWith("title")) {
		sorted.sort(compareTitle);
	}
	if (sort.endsWith("-desc")) {
		sorted.reverse();
	}

	return sorted;
}
// Reads what is chosen in the filter and sort boxes
export function getFilterValues() {
	const categorySelect = document.querySelector<HTMLSelectElement>("#filter-category");
	const memberSelect = document.querySelector<HTMLSelectElement>("#filter-member");
	const sortSelect = document.querySelector<HTMLSelectElement>("#sort");

	return {
		category: categorySelect?.value ?? "",
		memberId: memberSelect?.value ?? "",
		sort: sortSelect?.value ?? "deadline-asc",
	};
}
// Runs onChange every time someone changes a filter or the sorting
export function setupTaskFilters(onChange: () => void): void {
	const selects = document.querySelectorAll<HTMLSelectElement>(
		"#filter-category, #filter-member, #sort",
	);

	for (const select of selects) {
		select.addEventListener("change", onChange);
	}
}
// Fills the member filter with the members so you can pick one of them
export function renderMemberFilter(members: Member[]): void {
	const memberSelect = document.querySelector<HTMLSelectElement>("#filter-member");

	if (!memberSelect) {
		console.error("renderMemberFilter: saknar #filter-member i HTML");
		return;
	}
	for (const member of members) {
		memberSelect.append(createSelectOption(member.getName(), member.getId()));
	}
}
