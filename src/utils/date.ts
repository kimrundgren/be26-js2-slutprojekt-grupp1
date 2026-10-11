// Formaterar ett ISO-datum enligt angivet formatmönster
export function formatDate(isoDate: string, format: string): string {
	const [year, month, day] = isoDate.split("T")[0].split("-");

	return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}
