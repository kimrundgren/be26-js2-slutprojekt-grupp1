// Displays a form error message
export function renderFormError(element: HTMLElement, message: string): void {
	element.textContent = message;
	element.classList.remove("d-none");
}

// Clears and hides the form error
export function clearFormError(element: HTMLElement): void {
	element.textContent = "";
	element.classList.add("d-none");
}
