/**
 * Formats an ISO date using the specified format.
 *
 * @param isoDate - ISO date string or Date object
 * @param format - Desired date format
 * @returns Formatted date string
 */
export function formatDate(isoDate: string | Date, format: string): string {
	let date: string;

	if (isoDate instanceof Date) {
		const year = isoDate.getFullYear();
		const month = String(isoDate.getMonth() + 1).padStart(2, "0");
		const day = String(isoDate.getDate()).padStart(2, "0");

		date = `${year}-${month}-${day}`;
	} else {
		date = isoDate.split("T")[0];
	}

	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

	if (!match) {
		console.error("formatDate: Invalid date format.");
		return date;
	}

	const [, year, month, day] = match;
	const parsedDate = new Date(`${date}T00:00:00Z`);

	if (
		parsedDate.getUTCFullYear() !== Number(year) ||
		parsedDate.getUTCMonth() + 1 !== Number(month) ||
		parsedDate.getUTCDate() !== Number(day)
	) {
		console.error("formatDate: Invalid calendar date.");
		return date;
	}

	return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}
