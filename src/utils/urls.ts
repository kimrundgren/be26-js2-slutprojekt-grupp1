// Hämtar projektets ID från URL:ens query-parametrar
export function getProjectId(): string | null {
	return new URLSearchParams(window.location.search).get("id");
}
