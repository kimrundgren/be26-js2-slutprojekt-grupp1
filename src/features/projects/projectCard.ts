import { Project } from "../../models/Project";
import { DATE_FORMAT } from "../../constants";
import { formatDate } from "../../utils/date";

//Builds one project card
export function createProjectCard(project: Project, ongoingCount: number): HTMLElement {
	const mainDiv = document.createElement("div");
	mainDiv.className = "col-sm-6";

	const card = document.createElement("a");
	card.className = "card text-decoration-none text-reset";
	card.href = `project.html?id=${project.getId()}`;

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const title = document.createElement("h3");
	title.className = "h5 fw-bold";
	title.textContent = project.getName();

	const description = document.createElement("p");
	description.className = "small text-muted";
	description.textContent = project.getDescription();

	const childDiv = document.createElement("div");
	childDiv.className = "d-flex gap-2 flex-wrap";

	const members = document.createElement("span");
	members.className = "badge bg-body-secondary text-body fw-normal";
	members.textContent = project.getMemberCount() + " medlemmar";

	const ongoing = document.createElement("span");
	ongoing.className = "badge bg-body-secondary text-body fw-normal";
	ongoing.textContent = `${ongoingCount} pågående`;

	const deadline = document.createElement("span");
	deadline.className = "badge bg-body-secondary text-body fw-normal";
	deadline.textContent = formatDate(project.getDeadline(), DATE_FORMAT);

	childDiv.append(members, ongoing, deadline);
	cardBody.append(title, description, childDiv);
	card.appendChild(cardBody);
	mainDiv.appendChild(card);

	return mainDiv;
}
