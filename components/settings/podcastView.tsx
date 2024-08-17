import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
// dont use svg use png, or jpg
import Audiodump from "@assets/podcast/podcast_audiodump.svg";
import MalikFM from "@assets/podcast/podcast_malik-fm.svg";
import BitsundSo from "@assets/podcast/podcast_bitsundso.svg";
import FreakShow from "@assets/podcast/podcast_freak-show.svg";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";

const podcasts = [
	{ link: "https://audiodump.de", icon: Audiodump },
	{ link: "https://malik.fm", icon: MalikFM },
	{ link: "https://bitsundso.de", icon: BitsundSo },
	{
		link: "https://freakshow.fm/",
		icon: FreakShow,
	},
];

export function PodcastView(): JSX.Element {
	const size = scale(70);
	return (
		<View>
			<Text style={styles.headLine}>PODCASTFUCHS</Text>
			<Text style={styles.italicText}>
				Abonnieren Sie, sonst ist der Fuchs ganz traurig.
			</Text>
			<View
				style={{
					flexDirection: "row",
					columnGap: scale(10),
					marginTop: scale(12),
				}}
			>
				{podcasts.map(({ link, icon: Icon }) => (
					<TouchableOpacity
						key={link}
						activeOpacity={0.9}
						onPress={async () => await Linking.openURL(link)}
					>
						<Icon width={size} height={size} />
					</TouchableOpacity>
				))}
			</View>
			<Line style={{ marginTop: scale(20) }} />
		</View>
	);
}
