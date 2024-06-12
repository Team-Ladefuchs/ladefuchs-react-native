import { useLocales } from "expo-localization";

let formatter: { format: (v: number) => string } | null = null;

export function useFormatNumber() {
	const [{ languageTag }] = useLocales();

	if (!formatter) {
		formatter = Intl.NumberFormat(languageTag, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}
	function formatNumber(value: number | null | undefined): string | null {
		if (!value) {
			return null;
		}
		return formatter!.format(value);
	}

	function formatCurrency(value: number): string {
		return `${formatNumber(value)} €`;
	}

	return { formatCurrency, formatNumber };
}
