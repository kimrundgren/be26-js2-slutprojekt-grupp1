/**
 * Formats an ISO date using the specified format.
 *
 * @param isoDate - ISO date string
 * @param format - Desired date format
 * @returns Formatted date string
 */
export function formatDate(isoDate: string, format: string): string {
	const date = isoDate.split("T")[0];
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

	if (!match) {
		console.error("formatDate: Invalid date format.");
		return isoDate;
	}

	const [, year, month, day] = match;
	const parsedDate = new Date(`${date}T00:00:00Z`);

	if (
		parsedDate.getUTCFullYear() !== Number(year) ||
		parsedDate.getUTCMonth() + 1 !== Number(month) ||
		parsedDate.getUTCDate() !== Number(day)
	) {
		console.error("formatDate: Invalid calender date.");
		return isoDate;
	}

	return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}
