/**
 * Creates an option element.
 *
 * @param label - The text displayed for the option.
 * @param value - The value assigned to the option.
 * @returns The created option element.
 */
export function createSelectOption(label: string, value: string): HTMLOptionElement {
	return new Option(label, value);
}

/**
 * Clears the contents of the specified elements.
 *
 * @param elements - The elements whose contents should be cleared.
 */
export function clearElements(elements: HTMLElement[]): void {
	for (const element of elements) {
		element.replaceChildren();
	}
}
