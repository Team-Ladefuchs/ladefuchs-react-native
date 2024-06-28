import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme";

export function FeedbackButton({ link }: { link: string | null | undefined }): JSX.Element {
	const navigation = useNavigation();

	if (!link) {
		return <></>;
	}

	const onPress = () => {
		navigation.navigate("Feedback");
	};

	return (
		<SafeAreaView style={{ marginTop: 20, marginHorizontal: 0 }}>
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.button}
				onPress={onPress}
			>
				<Text style={[styles.headerText, styles.underlinedText]}>
					{"Preise falsch? Dann sag dem Fuchs Bescheid!"}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({


	underlinedText: {
		textDecorationLine: 'underline',
		color: "grey",
		fontFamily: "Bitter",
		fontSize: 15,
		lineHeight: 20,
	  },
});
