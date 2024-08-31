import { useState, useEffect } from "react";

export function useDebounceInput(
	delay = 125,
): [string, (value: string) => void] {
	const [value, setValue] = useState<string>("");
	const [debouncedValue, setDebouncedValue] = useState<string>("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return [debouncedValue, setValue];
}
