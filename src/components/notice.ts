import type { NoticeType } from "../types/types";

const noticeClasses: Record<NoticeType, string> = {
	success: "alert-success",
	error: "alert-danger",
};

// Display duration in milliseconds
const noticeDurations: Record<NoticeType, number> = {
	success: 4000,
	error: 8000,
};

let noticeTimeout: number | undefined;

// Displays a notice and hides it automatically
export function renderNotice(message: string, type: NoticeType): void {
	const notice = document.querySelector<HTMLDivElement>("#notice");

	if (!notice) {
		console.error('renderNotice: Required element "#notice" not found in HTML.');
		return;
	}

	clearNotice();

	notice.textContent = message;
	notice.classList.add(noticeClasses[type]);
	notice.classList.remove("d-none");

	noticeTimeout = window.setTimeout(clearNotice, noticeDurations[type]);
}

// Clears and hides the notice
export function clearNotice(): void {
	if (noticeTimeout !== undefined) {
		window.clearTimeout(noticeTimeout);
		noticeTimeout = undefined;
	}

	const notice = document.querySelector<HTMLDivElement>("#notice");

	if (!notice) return;

	notice.textContent = "";
	notice.classList.remove(...Object.values(noticeClasses));
	notice.classList.add("d-none");
}
