import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { fetchOperators } from "../functions/api";

const OperatorPicker = ({ onSelect }) => {
	const [selectedValue, setSelectedValue] = useState("");

	const { isPending, error, data } = useQuery({
		queryKey: ["operators"],
		queryFn: async () => {
			return await fetchOperators({ standard: true });
		},
	});

	if (isPending || error) {
		return null;
	}

	return (
		<Picker
			selectedValue={selectedValue}
			style={{ height: 50, width: "100%" }}
			itemStyle={{ fontSize: 20 }}
			onValueChange={(itemValue, itemIndex) => {
				setSelectedValue(itemValue);
				onSelect(itemValue);
			}}
		>
			{data?.map((operator) => (
				<Picker.Item
					key={operator.identifier}
					label={operator.name}
					value={operator.identifier}
				/>
			))}
		</Picker>
	);
};

export default OperatorPicker;
