import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Audiodump from "@assets/podcast/podcast_audiodump.svg"; // Ensure this path is correct
import MalikFM from "@assets/podcast/podcast_malik-fm.svg"; // Ensure this path is correct
import BitsundSo from "@assets/podcast/podcast_bitsundso.svg"; // Ensure this path is correct
import { styles } from "../../theme";

export function PodcastView(): JSX.Element {
	const touchOpacity = 1;
	return (
		<View style={styles.headerView}>
			<Text style={styles.headLine}>PODCASTFUCHS</Text>
			<Text style={styles.sponsorText}>
				Abonnieren Sie, sonst ist der Fuchs ganz traurig.
			</Text>
			<View style={{ flexDirection: "row", columnGap: 10 }}>
				<TouchableOpacity
					activeOpacity={touchOpacity}
					onPress={async () =>
						await Linking.openURL("https://audiodump.de")
					}
				>
					<Audiodump width={100} height={100} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={touchOpacity}
					onPress={async () =>
						await Linking.openURL("https://malik.fm")
					}
				>
					<MalikFM width={100} height={100} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={touchOpacity}
					onPress={async () =>
						await Linking.openURL("https://bitsundso.de")
					}
				>
					<BitsundSo width={100} height={100} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
