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
		<SafeAreaView style={{ marginTop: 10, marginHorizontal: 0 }}>
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.button}
				onPress={onPress}
			>
				<Text style={styles.buttonText}>
					{"Gib uns Feedback zum Preis!".toLocaleUpperCase()}
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		...Platform.select({
			android: {
				padding: 9,
				marginBottom: 16,
			},
			default: {
				padding: 12,
				marginBottom: 12,
			},
		}),
		backgroundColor: colors.ladefuchsLightGrayBackground,
		borderRadius: 12,
	},
	buttonText: {
		...Platform.select({
			android: {
				fontSize: 20,
			},
			default: {
				fontSize: 20,
			},
		}),
		color: "#343a40",
		textAlign: "center",
		fontWeight: "bold",
	},
});
