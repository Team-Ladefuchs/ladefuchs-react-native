// CheckboxComponent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

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
                <CheckBox
                    key={option.value}
                    title={option.label}
                    checked={selectedOptions.includes(option.value)}
                    onPress={() => handleCheckboxChange(option.value)}
                    containerStyle={styles.checkboxContainer}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
});
