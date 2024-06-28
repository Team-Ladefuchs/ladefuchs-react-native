import { useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => void {
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [delay]);

	// Debounce function
	const debouncedFunction = (...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callbackRef.current(...args);
		}, delay);
	};

	return debouncedFunction;
}
