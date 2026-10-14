import type { CATEGORIES, PRIORITIES } from "../constants";

// Category and priority types
export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];

// General types
export type NoticeType = "success" | "error";

// Project types
export interface ProjectData {
	name: string;
	description: string;
	deadline: string;
	memberIds?: string[];
}

// Task types
export type TaskStatus = "new" | "ongoing" | "done";

export interface TaskData {
	created: string;
	projectId: string;
	title: string;
	description: string;
	category: Category;
	status: TaskStatus;
	priority: Priority;
	deadline: string;
	completed?: string;
	memberId?: string;
}

// Member types
export interface MemberData {
	name: string;
	category: Category;
	projectIds?: string[];
}
