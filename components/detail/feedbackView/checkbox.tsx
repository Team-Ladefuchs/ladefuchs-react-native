// CheckboxComponent.tsx
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, styles } from "../../../theme";

interface CheckboxComponentProps {
    options: { label: string; value: string }[];
    selectedOptions?: string[];
    onValueChange: (selectedOptions: string[]) => void;
}

export const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
    options,
    selectedOptions = [],
    onValueChange,
}) => {
    const handleCheckboxChange = (option: string) => {
        const newSelectedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((selectedOption) => selectedOption !== option)
            : [...selectedOptions, option];
        onValueChange(newSelectedOptions);
    };

    return (
        <View style={styles.container}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={styles.checkboxContainer}
                    onPress={() => handleCheckboxChange(option.value)}
                >
                    <View style={styles.checkbox}>
                        {selectedOptions.includes(option.value) && (
                            <Icon name="check" size={24} color="#000" />
                        )}
                    </View>
                    <Text style={styles.label}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
