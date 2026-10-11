import type { ProjectData } from "../types/types";

export class Project {
	private readonly id: string;
	private name: string;
	private description: string;
	private deadline: string;
	private memberIds: string[];

	constructor(id: string, data: ProjectData) {
		this.id = id;
		this.memberIds = data.memberIds ?? [];
		this.name = data.name;
		this.description = data.description;
		this.deadline = data.deadline;
	}

	getId(): string {
		return this.id;
	}

	getName(): string {
		return this.name;
	}
	getDescription(): string {
		return this.description;
	}

	getDeadline(): string {
		return this.deadline;
	}

	getMemberIds(): string[] {
		return this.memberIds;
	}

	getMemberCount(): number {
		return this.memberIds.length;
	}
}
