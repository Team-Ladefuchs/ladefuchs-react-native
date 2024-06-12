import { useLocales } from "expo-localization";
import { useMemo } from "react";
declare global {
	interface Array<T> {
		shuffle(): T[];
		pickRandom(): T | null;
	}
}

export function fill<T>(list1: T[], list2: T[]): [T[], T[]] {
	const len1 = list1.length;
	const len2 = list2.length;

	if (len1 < len2) {
		list1.push(...Array(len2 - len1).fill(null));
	} else if (len2 < len1) {
		list2.push(...Array(len1 - len2).fill(null));
	}

	return [list1, list2];
}

export function zip<T>(arr1: T[], arr2: T[]): [T, T][] {
	const length = Math.min(arr1.length, arr2.length);
	const zippedArray: [T, T][] = [];

	for (let i = 0; i < length; i++) {
		zippedArray.push([arr1[i], arr2[i]]);
	}

	return zippedArray;
}

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this;
};

Array.prototype.shuffle = function <T>() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this as T[];
};

export function pickRandom<T>(items: T[]) {
	if (items.length === 0) return null;
	const index = Math.floor(Math.random() * items.length);
	return items[index];
}

export function repeatNTimes<T>(item: T, n: number): T[] {
	const repeatedIds: T[] = [];
	for (let i = 0; i < n; i++) {
		repeatedIds.push(item);
	}
	return repeatedIds;
}

let formatter: { format: (v: number) => string } | null = null;
export function formatNumber(value: number): string | null {
	const [{ languageTag }] = useLocales();

	if (!value) {
		return null;
	}
	if (!formatter) {
		formatter = Intl.NumberFormat(languageTag, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}
	return useMemo(() => formatter!.format(value), [value]);
}

export function formatNumberCurrency(value: number): string {
	return `${formatNumber(value)} €`;
}
