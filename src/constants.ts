import type { Category, Priority } from "./types/types";

// API
export const BASE_URL = "https://scrum-board-4d46b-default-rtdb.europe-west1.firebasedatabase.app";

// Categories
export const CATEGORIES = ["frontend", "backend", "ux"] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
	frontend: "Frontend",
	backend: "Backend",
	ux: "UX",
};

// Priorities
export const PRIORITIES = ["low", "medium", "high"] as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: "Låg",
	medium: "Medel",
	high: "Hög",
};

// Date formatting
export const DATE_FORMAT = "YYYY-MM-DD";
