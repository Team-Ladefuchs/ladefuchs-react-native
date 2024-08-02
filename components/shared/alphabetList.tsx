import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet } from "react-native-size-matters";

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

interface AlphabetListProps {
  onLetterPress: (letter: string) => void;
}

export const AlphabetList: React.FC<AlphabetListProps> = ({ onLetterPress }) => {
  return (
    <View style={styles.container}>
      {alphabet.map(letter => (
        <TouchableOpacity key={letter} onPress={() => onLetterPress(letter)}>
          <Text style={styles.letter}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    right: "8@s",
    top: "18@s",
    //bottom: "10@s",
    //justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: "13@s",
	fontWeight:"500",
    paddingVertical: "1@s",
    paddingHorizontal: "2@s",
    color: '#000',
  },
});
