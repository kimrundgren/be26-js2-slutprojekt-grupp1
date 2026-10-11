import type { NoticeType } from "../types/types";

const noticeClasses: Record<NoticeType, string> = {
	success: "alert-success",
	error: "alert-danger",
};

// Error visas längre än success notiser (millisekunder)
const noticeDurations: Record<NoticeType, number> = {
	success: 4000,
	error: 8000,
};

let noticeTimeout: number | undefined;

// Visar en notice nere på sidan och döljer den automatiskt
export function renderNotice(message: string, type: NoticeType): void {
	const notice = document.querySelector<HTMLDivElement>("#notice");

	if (!notice) {
		console.error("renderNotice: saknar #notice i HTML");
		return;
	}

	clearNotice();

	notice.textContent = message;
	notice.classList.add(noticeClasses[type]);
	notice.classList.remove("d-none");

	noticeTimeout = window.setTimeout(clearNotice, noticeDurations[type]);
}

// Rensar och döljer notice
export function clearNotice(): void {
	const notice = document.querySelector<HTMLDivElement>("#notice");

	if (!notice) return;

	clearTimeout(noticeTimeout);
	notice.textContent = "";
	notice.classList.remove(...Object.values(noticeClasses));
	notice.classList.add("d-none");
}
