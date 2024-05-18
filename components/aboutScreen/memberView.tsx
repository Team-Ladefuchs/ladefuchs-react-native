import React from "react";
import { Text, View, Image, TouchableOpacity, Linking } from "react-native";
import { styles } from "../../theme";

export function Memberview() {
	const members = [
		{
			name: "MALIK",
			role: "Designfuchs",
			imageSource: require("../../assets/team_malik.jpg"),
			links: [
				{
					text: "@malik",
					url: "https://mastodon.social/@malik",
					icon: require("../../assets/icon_masto.png"),
				},
				{
					text: "malik@ladefuchs.app",
					url: "mailto:malik@ladefuchs.app",
					icon: require("../../assets/icon_mail.png"),
				},
			],
		},
		{
			name: "DOMINIC",
			role: "APIfuchs",
			imageSource: require("../../assets/team_dominic.jpg"),
			links: [
				{
					text: "@dominic",
					url: "https://social.linux.pizza/@dominicwrege",
					icon: require("../../assets/icon_masto.png"),
				},
				{
					text: "api@ladefuchs.app",
					url: "mailto:api@ladefuchs.app",
					icon: require("../../assets/icon_mail.png"),
				},
			],
		},
		{
			name: "SVEN",
			role: "APPfuchs",
			imageSource: require("../../assets/team_sven.jpeg"),
			links: [
				{
					text: "@hexer",
					url: "https://chaos.social/@svenraskin",
					icon: require("../../assets/icon_masto.png"),
				},
				{
					text: "sven@ladefuchs.app",
					url: "mailto:sven@ladefuchs.app",
					icon: require("../../assets/icon_mail.png"),
				},
			],
		},
	];

	return (
		<>
			{members.map((member, index) => (
				<View
					key={index}
					style={{
						flexDirection: "row",
						paddingHorizontal: 30,
						paddingVertical: 20,
					}}
				>
					<Image
						style={styles.memberImage}
						source={member.imageSource}
					/>
					<View style={{ paddingVertical: 10 }}>
						<Text style={styles.headLine}>{member.name}</Text>
						<Text style={styles.memberText}>{member.role}</Text>
						{member.links.map((line, idx) => (
							<TouchableOpacity
								key={idx}
								onPress={() => Linking.openURL(line.url)}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Image
										source={line.icon}
										style={{
											width: 20,
											height: 20,
											marginRight: 5,
										}}
									/>
									<Text
										style={{
											fontFamily: "Bitter",
											fontSize: 15,
											lineHeight: 20,
										}}
									>
										{line.text}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			))}
		</>
	);
}
