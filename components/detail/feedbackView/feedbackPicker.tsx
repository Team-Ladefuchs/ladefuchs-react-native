import React from "react";
import { styles } from "../../../theme";
import { Picker } from "@react-native-picker/picker";
import WheelPicker from "react-native-wheely";
import { scale } from "react-native-size-matters";
import { Platform, View} from "react-native";

interface PickerComponentProps {
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
}

export const PickerComponent: React.FC<PickerComponentProps> = ({
    selectedValue,
    onValueChange,
}) => {
	if (Platform.OS === "android") {
		return (
			<View
				style={{
					...styles.pickerContainer,
					paddingHorizontal: scale(16),
					marginBottom: 250,
				}}
			>

			</View>
		);

	}
    return (
        <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={onValueChange}
        >
            <Picker.Item label="AC Preis" value="AC" />
            <Picker.Item label="DC Preis" value="DC" />
            <Picker.Item label="Blockiergebühr" value="Blockiergebühr" />
            <Picker.Item label="Monatliche Gebühr" value="Monatliche Gebühr" />
        </Picker>
    );
};
