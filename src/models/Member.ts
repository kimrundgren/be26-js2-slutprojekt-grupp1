import type { Category, MemberData } from "../types/types";

export class Member {
	private readonly id: string;
	private name: string;
	private category: Category;
	private projectIds: string[];

	constructor(id: string, data: MemberData) {
		this.id = id;
		this.name = data.name;
		this.category = data.category;
		this.projectIds = data.projectIds ?? [];
	}

	getId(): string {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	setName(name: string): void {
		this.name = name;
	}

	getCategory(): Category {
		return this.category;
	}

	setCategory(category: Category): void {
		this.category = category;
	}

	getProjectIds(): string[] {
		return [...this.projectIds];
	}

	addProjectId(projectId: string): void {
		if (!this.projectIds.includes(projectId)) {
			this.projectIds.push(projectId);
		}
	}

	removeProjectId(projectId: string): void {
		this.projectIds = this.projectIds.filter((id) => id !== projectId);
	}
}
