import type { CATEGORIES, PRIORITIES } from "../constants";

export type Category = (typeof CATEGORIES)[number];
export type TaskStatus = "new" | "ongoing" | "done";
export type Priority = (typeof PRIORITIES)[number];
export type NoticeType = "success" | "error";

export interface ProjectData {
	name: string;
	description: string;
	deadline: string;
	memberIds?: string[];
}

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

export interface MemberData {
	name: string;
	category: Category;
	projectIds?: string[];
}
