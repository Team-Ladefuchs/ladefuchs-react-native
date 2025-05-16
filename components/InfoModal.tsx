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

type InfoModalProps = {
	visible: boolean;
	onClose: () => void;
};

export function InfoModal({ visible, onClose }: InfoModalProps) {
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
						maxHeight: "60%",
					}}
				>
					<ScrollView bounces={true}>
						<Text style={styles.headLine}>
							Liebe Ladefuchs-User:innen,
						</Text>
						<Text style={styles.italicText}>
							Babysteps: EnBW Preise sind wieder da! Nach wie vor
							ist noch viel zu klären und aufzuräumen… stay with
							us! Vielen Dank für die aufmunternden Worte, Spenden
							und positiven Bewertungen in den App Stores! 🧡
							{"\n"}
							Backend-Zauberei: Die meiste Arbeit passiert gerade
							unsichtbar im Hintergrund. Daten werden sortiert,
							Systeme neu verdrahtet, der Fuchs schwitzt leise im
							Serverraum.🔧🧙‍♂️
							{"\n"} Alle aktuellen Updates findet ihr unter:
						</Text>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={async () =>
								await Linking.openURL(
									"https://electroverse.tech/@ladefuchs",
								)
							}
							style={{ marginVertical: 8 }}
						>
							<Text style={styles.settingsLink}>
								electroverse.tech/@ladefuchs
							</Text>
						</TouchableOpacity>
						<Text style={styles.italicText}>
							Liebe Grüße{"\n"}eure Ladefüchse
						</Text>
					</ScrollView>
					<Button title="Schließen" onPress={onClose} />
				</View>
			</View>
		</Modal>
	);
}
