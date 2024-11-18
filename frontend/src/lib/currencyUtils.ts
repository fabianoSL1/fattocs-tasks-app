export function parseCurrency(cents: bigint): string {
	return (cents / BigInt(100)).toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function parseToCents(value: string) {
	const parsed = Number.parseFloat(value.replace(",", "."));
	return BigInt(Math.round(parsed * 100));
}
