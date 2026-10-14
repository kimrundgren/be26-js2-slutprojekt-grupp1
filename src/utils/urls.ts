/**
 * Gets the project ID from the URL query parameters.
 *
 * @returns The project ID or null if it doesn't exist.
 */
export function getProjectId(): string | null {
	return new URLSearchParams(window.location.search).get("id");
}
