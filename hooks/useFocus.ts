import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useFocus() {
	const [focus, setIsFocused] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);
		}, []),
	);

	return { focus };
}
