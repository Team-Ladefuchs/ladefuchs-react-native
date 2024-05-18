import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Audiodump from "../../assets/podcast_audiodump.svg"; // Ensure this path is correct
import MalikFM from "../../assets/podcast_malik-fm.svg"; // Ensure this path is correct
import BitsundSo from "../../assets/podcast_bitsundso.svg"; // Ensure this path is correct
import { styles } from "../../theme";

export function Podcastview() {
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>PODCASTFUCHS</Text>
			<Text style={styles.sponsorText}>
				Abonnieren Sie, sanst ist der Fuchs ganz traurig.
			</Text>
			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity
					onPress={() => Linking.openURL("https://audiodump.de")}
				>
					<Audiodump width={100} height={100} marginRight={10} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => Linking.openURL("https://malik.fm")}
				>
					<MalikFM width={100} height={100} marginRight={10} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => Linking.openURL("https://bitsundso.de")}
				>
					<BitsundSo width={100} height={100} marginRight={10} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
