export function parseCurrency(cents: bigint): string {
	const formattedAmount = (cents / BigInt(100))
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	const formattedCents = (cents % BigInt(100)).toString().padStart(2, "0");

	return `${formattedAmount},${formattedCents}`;
}

export function parseToCents(value: string) {
	const [_amount, cents] = value.split(",");

	let amount = BigInt(_amount.replace(/\./g, ""));

	amount *= BigInt(100);

	if (cents) {
		amount += BigInt(cents);
	}

	return amount;
}
