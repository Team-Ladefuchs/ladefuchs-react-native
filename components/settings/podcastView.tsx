import React from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { styles } from "../../theme";
import { scale } from "react-native-size-matters";
import { Line } from "./line";
import i18n from "../../localization";

const podcasts = [
	{
		link: "https://audiodump.de",
		image: require("@assets/podcast/audiodump.jpg"),
	},
	{
		link: "https://malik.fm",
		image: require("@assets/podcast/malik-fm.jpg"),
	},
	{
		link: "https://bitsundso.de",
		image: require("@assets/podcast/bitsundso.png"),
	},
	{
		link: "https://freakshow.fm/",
		image: require("@assets/podcast/freak-show.jpg"),
	},
] as const;

export function PodcastView(): JSX.Element {
	const size = scale(70);
	return (
		<View>
			<Text style={styles.headLine}>{i18n.t('podcastfuchs')}</Text>
			<Text style={styles.italicText}>
			{i18n.t('podcastfuchstext')}
			</Text>
			<View
				style={{
					flexDirection: "row",
					columnGap: scale(10),
					marginTop: scale(12),
				}}
			>
				{podcasts.map(({ link, image }) => (
					<TouchableOpacity
						key={link}
						activeOpacity={0.9}
						onPress={async () => await Linking.openURL(link)}
					>
						<Image
							source={image}
							style={{
								height: size,
								width: size,
								borderRadius: scale(6),
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
			<Line style={{ marginTop: scale(20) }} />
		</View>
	);
}
