export function parseCurrency(cents: number) {
	return (cents / 100).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function parseToCents(value: string) {
	return Math.round(Number.parseFloat(value.replace(",", ".")) * 100);
}
