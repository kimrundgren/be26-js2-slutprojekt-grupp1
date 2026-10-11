// Bygger <option> för ett värde
export function createSelectOption(label: string, value: string): HTMLOptionElement {
	return new Option(label, value);
}

// Rensar innehållet i de angivna elementen
export function clearElements(elements: HTMLElement[]): void {
	for (const element of elements) {
		element.replaceChildren();
	}
}
