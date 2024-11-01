const formatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export function parseCurrency(cents: number) {
	return formatter.format(cents / 100);
}
