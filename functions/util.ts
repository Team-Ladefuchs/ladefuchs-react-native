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

export function shuffle<T>(data: T[]): T[] {
	for (let i = data.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[data[i], data[j]] = [data[j], data[i]];
	}
	return data;
}

export function pickRandom<T>(items: T[]): T[] {
	if (items.length === 0) return [];
	const index = Math.floor(Math.random() * items.length);
	return [items[index]];
}

function compose<T>(...functions: ((arg: T) => T)[]): (arg: T) => T {
	return (arg: T) => functions.reduce((acc, fn) => fn(acc), arg);
}

export const shuffleAndPickOne = compose(
	repeatItemsByFrequency,
	shuffle,
	pickRandom
);

function repeatNTimes<T>(element: T, times: number): T[] {
	return Array.from({ length: times }, () => element);
}

export function repeatItemsByFrequency<T extends { frequency: number }>(
	items: T[]
): T[] {
	return items.flatMap((item) => repeatNTimes(item, item.frequency));
}

export function hyphenText(input: string): string {
	const hyphenTextMap: Record<string, string> = {
		Stadtwerke: "Stadt\u2010werke",
	};
	let result = input;
	for (const [key, hyphenatedValue] of Object.entries(hyphenTextMap)) {
		// Create a regular expression to match the whole word
		const regex = new RegExp(`\\b${key}\\b`, "g");
		result = result.replace(regex, hyphenatedValue);
	}
	return result;
}

export async function fetchWithTimeout(
	url: string,
	options: RequestInit = null,
	timeout = 2800
) {
	const controller = new AbortController();
	options.signal = controller.signal;

	const timeoutId = setTimeout(() => {
		controller.abort();
	}, timeout);

	try {
		const response = await fetch(url, options);
		clearTimeout(timeoutId);
		return response;
	} finally {
		clearTimeout(timeoutId);
	}
}

export function parseDecimal(value: string): number {
	return parseFloat(value.replace(",", ".") || "0");
}
