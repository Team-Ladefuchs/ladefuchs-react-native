import React from "react";
import {
	Modal,
	View,
	Text,
	Button,
	TouchableOpacity,
	Linking,
	ScrollView,
} from "react-native";
import { styles } from "../theme";

type InfoContentSection =
	| { type: "headline"; text: string }
	| { type: "text"; text: string }
	| { type: "link"; text: string; url: string };

type InfoModalProps = {
	visible: boolean;
	onClose: () => void;
	content: InfoContentSection[];
};

export function InfoModal({ visible, onClose, content }: InfoModalProps) {
	if (!visible || !content || content.length === 0) {
		return null;
	}
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "rgba(0,0,0,0.5)",
				}}
			>
				<View
					style={{
						backgroundColor: "white",
						padding: 24,
						borderRadius: 12,
						maxWidth: "80%",
						minWidth: "80%",
						maxHeight: "60%",
						minHeight: "40%",
					}}
				>
					<ScrollView bounces={true}>
						{content.map((section, idx) => {
							switch (section.type) {
								case "headline":
									return (
										<Text
											key={idx}
											style={[
												styles.headLine,
												{ marginBottom: 16 },
											]}
										>
											{section.text}
										</Text>
									);
								case "text":
									return (
										<Text
											key={idx}
											style={[
												styles.italicText,
												{ fontSize: 16 },
											]}
										>
											{section.text}
										</Text>
									);
								case "link":
									return (
										<TouchableOpacity
											key={idx}
											activeOpacity={0.8}
											onPress={async () =>
												await Linking.openURL(
													section.url,
												)
											}
											style={{ marginVertical: 8 }}
										>
											<Text style={styles.settingsLink}>
												{section.text}
											</Text>
										</TouchableOpacity>
									);
								default:
									return null;
							}
						})}
					</ScrollView>
					<Button title="Schließen" onPress={onClose} />
				</View>
			</View>
		</Modal>
	);
}
