import type { TaskData, Category, Priority, TaskStatus } from "../types/types";

/**
 * Represents a task in the project.
 */
export class Task {
	private readonly id: string;
	private readonly created: string;
	private readonly projectId: string;
	private title: string;
	private description: string;
	private category: Category;
	private status: TaskStatus;
	private priority: Priority;
	private deadline: string;
	private completed?: string;
	private memberId?: string;

	constructor(id: string, data: TaskData) {
		this.id = id;
		this.created = data.created;
		this.projectId = data.projectId;
		this.title = data.title;
		this.description = data.description;
		this.category = data.category;
		this.status = data.status;
		this.priority = data.priority;
		this.deadline = data.deadline;
		this.completed = data.completed;
		this.memberId = data.memberId;
	}

	getId(): string {
		return this.id;
	}

	getCreated(): string {
		return this.created;
	}

	getProjectId(): string {
		return this.projectId;
	}

	getTitle(): string {
		return this.title;
	}

	getDescription(): string {
		return this.description;
	}

	getCategory(): Category {
		return this.category;
	}

	getStatus(): TaskStatus {
		return this.status;
	}

	setStatus(newStatus: TaskStatus): void {
		this.status = newStatus;
	}

	getPriority(): Priority {
		return this.priority;
	}

	setPriority(newPriority: Priority): void {
		this.priority = newPriority;
	}

	getDeadline(): string {
		return this.deadline;
	}

	setDeadline(newDeadline: string): void {
		this.deadline = newDeadline;
	}

	getCompleted(): string | undefined {
		return this.completed;
	}

	setCompleted(newCompleted: string): void {
		this.completed = newCompleted;
	}

	getAssignedMember(): string | undefined {
		return this.memberId;
	}

	setAssignedMember(memberId: string): void {
		this.memberId = memberId;
	}
}
