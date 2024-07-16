import { useState, useCallback } from "react";

interface UseCounterReturn {
	value: number;
	increment: () => void;
	decrement: () => void;
}

interface UseCounterProps {
	initialValue: number;
	minValue?: number;
	maxValue?: number;
}

function incrementFloatBy(currentValue: number, increment: -1 | 1): number {
	return Math.round(currentValue * 100 + increment) / 100;
}

export function useCounter({
	initialValue,
	minValue = 0,
	maxValue = 3,
}: UseCounterProps): UseCounterReturn {
	const [value, setValue] = useState<number>(initialValue);

	const increment = useCallback(() => {
		setValue((prevValue) => {
			const newValue = incrementFloatBy(prevValue, 1);
			return newValue <= maxValue ? newValue : prevValue;
		});
	}, [maxValue]);

	const decrement = useCallback(() => {
		setValue((prevValue) => {
			const newValue = incrementFloatBy(prevValue, -1);
			return newValue >= minValue ? newValue : prevValue;
		});
	}, [minValue]);

	return {
		value,
		increment,
		decrement,
	};
}
