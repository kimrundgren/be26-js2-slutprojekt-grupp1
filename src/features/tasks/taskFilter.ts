import type { Task } from "../../models/Task";
import type { Member } from "../../models/Member";
import { createSelectOption } from "../../utils/dom";

// Filtrerar uppgifterna på kategori och medlem
export function filterTasks(tasks: Task[], category: string, memberId: string): Task[] {
	// Ger tillbaka den nya filtrerade listan
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
// Jämför vilken av de två uppgifter som har tidigast deadline
function compareDeadline(firstTask: Task, secondTask: Task): number {
	return firstTask.getDeadline().localeCompare(secondTask.getDeadline());
}
// Samma som föregående fast för titel."sv" gör att å,ä och ö sorteras rätt
function compareTitle(firstTask: Task, secondTask: Task): number {
	return firstTask.getTitle().localeCompare(secondTask.getTitle(), "sv");
}
// Sorterar uppgifterna efter det som är valt i sorteringsrutan
export function sortTasks(tasks: Task[], sort: string): Task[] {
	// Jobbar på en kopia, så att listan i boarden behåller sin ordning
	const sorted = [...tasks];

	if (sort.startsWith("deadline")) {
		sorted.sort(compareDeadline);
	}
	if (sort.startsWith("title")) {
		sorted.sort(compareTitle);
	}
	// Vänder listan från stigande till fallande
	// Påverkar bara kopian sorted
	if (sort.endsWith("-desc")) {
		sorted.reverse();
	}

	return sorted;
}
// Läser av vad som är valt i filter och sorteringsrutorna
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
// Kör onChange varje gång någon ändrar filter eller sortering
export function setupTaskFilters(onChange: () => void): void {
	const selects = document.querySelectorAll<HTMLSelectElement>(
		"#filter-category, #filter-member, #sort",
	);

	for (const select of selects) {
		select.addEventListener("change", onChange);
	}
}
// Fyller medlemsfiltret med alla medlemmar så man kan välja en av dem
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
