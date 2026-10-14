/**
 * Sends an API request and returns the response as JSON.
 *
 * @param url - The URL to send the request to.
 * @param options - Optional fetch configuration.
 * @returns The parsed JSON response.
 * @throws An error if the request fails or the response is unsuccessful.
 */
export async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	return response.json();
}
