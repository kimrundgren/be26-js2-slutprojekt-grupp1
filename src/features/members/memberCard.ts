import type { Member } from "../../models/Member";
import { CATEGORY_LABELS } from "../../constants";

export function createMemberCard(
	member: Member,
	projectNames: string[],
	ongoingCount: number,
): HTMLLIElement {
	const li = document.createElement("li");
	li.className = "list-group-item d-flex gap-3 px-0";

	const avatar = document.createElement("div");
	avatar.className =
		"rounded-circle bg-primary text-white small fw-medium d-flex align-items-center justify-content-center";
	avatar.style.width = "34px";
	avatar.style.height = "34px";
	avatar.textContent = getInitials(member.getName());

	const info = document.createElement("div");

	const name = document.createElement("span");
	name.className = "fw-bold";
	name.textContent = member.getName();

	const badge = document.createElement("span");
	badge.className = "badge bg-body-secondary text-body fw-normal";
	badge.textContent = CATEGORY_LABELS[member.getCategory()];

	const projectLine = document.createElement("div");
	projectLine.className = "small text-muted";
	projectLine.textContent = projectNames.length > 0 ? projectNames.join(", ") : "Inga projekt";

	const ongoingLine = document.createElement("span");
	ongoingLine.className = "badge bg-body-secondary text-body fw-normal";
	ongoingLine.textContent = `${ongoingCount} pågående uppgifter`;

	info.append(name, " ", badge, projectLine, ongoingLine);
	li.append(avatar, info);

	return li;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.slice(0, 2)
		.join("");
}
