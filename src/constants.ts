import type { Priority, Category } from "./types/types";

export const BASE_URL = "https://scrum-board-4d46b-default-rtdb.europe-west1.firebasedatabase.app";

export const CATEGORIES = ["frontend", "backend", "ux"] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
	frontend: "Frontend",
	backend: "Backend",
	ux: "UX",
};

export const PRIORITIES = ["low", "medium", "high"] as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: "Låg",
	medium: "Medel",
	high: "Hög",
};

export const DATE_FORMAT = "YYYY-MM-DD";
