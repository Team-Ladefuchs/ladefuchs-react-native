// PickerComponent.tsx
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../../../theme";

interface PickerComponentProps {
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
}

export const PickerComponent: React.FC<PickerComponentProps> = ({
    selectedValue,
    onValueChange,
}) => {
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
