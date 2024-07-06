// CheckboxComponent.tsx
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../../theme';

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

const styles = StyleSheet.create({
	container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
		marginBottom: 0,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
        padding: 8,
        backgroundColor: colors.ladefuchsLightBackground,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.ladefuchsLightBackground,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
});
