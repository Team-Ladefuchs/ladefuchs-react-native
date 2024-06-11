import React, { useCallback, useEffect, useState } from "react";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { Text } from "react-native";
import { colors } from "../../theme";
import { Operator } from "../../types/operator";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
	items: { label: string; value: string }[];
	width: number;
	onChange: (selectedValue: string) => void;
}

export function AndroidPicker({ items, onChange, width }: Props): JSX.Element {
	const [selectedItem, setSelectedItem] = useState(items[0].value);
	const debouncedItem = useDebounce(selectedItem, 200);

	const [lastCalledValue, setLastCalledValue] = useState(null);

	const handleChange = useCallback(
		(value) => {
			if (value !== lastCalledValue) {
				onChange(value);
				setLastCalledValue(value);
			}
		},
		[lastCalledValue, onChange]
	);

	useEffect(() => {
		if (debouncedItem) {
			handleChange(debouncedItem);
		}
	}, [debouncedItem, handleChange]);

	return (
		<WheelPickerExpo
			backgroundColor={colors.ladefuchsLightBackground}
			initialSelectedIndex={0}
			haptics={true}
			width={width}
			renderItem={(props) => (
				<Text
					style={{
						fontSize: 21,
						fontWeight: "500",
						borderColor: "#202124",
					}}
				>
					{props.label}
				</Text>
			)}
			items={items}
			onChange={({ item }) => {
				setSelectedItem(item.value);
			}}
		/>
	);
}
