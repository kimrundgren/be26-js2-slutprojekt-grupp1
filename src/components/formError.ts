// Visar ett felmeddelande som text i ett formulär
export function renderFormError(element: HTMLElement, message: string): void {
	element.textContent = message;
	element.classList.remove("d-none");
}

// Rensar och döljer felmeddelandet i ett formulär
export function clearFormError(element: HTMLElement): void {
	element.textContent = "";
	element.classList.add("d-none");
}
