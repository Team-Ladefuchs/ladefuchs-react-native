import React from "react";
import {
	Text,
	View,
	Image,
	TouchableWithoutFeedback,
	Linking,
} from "react-native";
import { styles } from "../../theme";
import MailIcon from "@assets/about/icon_mail.svg";
import MastodonIcon from "@assets/about/icon_mastodon.svg";

export function MemberView(): JSX.Element {
	const members = [
		{
			name: "MALIK",
			role: "Designfuchs",
			imageSource: require("@assets/team/team_malik.jpg"),
			links: [
				{
					text: "@malik",
					url: "https://mastodon.social/@malik",
					icon: MastodonIcon,
				},
				{
					text: "malik@ladefuchs.app",
					url: "mailto:malik@ladefuchs.app",
					icon: MailIcon,
				},
			],
		},
		{
			name: "BASTI SCHLINGEL",
			role: "Androidfuchs",
			imageSource: require("@assets/team/team_basti.jpg"),
			links: [
				{
					text: "@schlingel",
					url: "https://mastodon.social/@schlingel",
					icon: MastodonIcon,
				},
				{
					text: "android@ladefuchs.app",
					url: "mailto:android@ladefuchs.app",
					icon: MailIcon,
				},
			],
		},
		{
			name: "FLOWINHO",
			role: "APFELfuchs",
			imageSource: require("@assets/team/team_flow.jpg"),
			links: [
				{
					text: "@flowinho",
					url: "https://chaos.social/@flowinho",
					icon: MastodonIcon,
				},
				{
					text: "ios@ladefuchs.app",
					url: "mailto:ios@ladefuchs.app",
					icon: MailIcon,
				},
			],
		},

		{
			name: "DOMINIC",
			role: "APIfuchs",
			imageSource: require("@assets/team/team_dominic.jpg"),
			links: [
				{
					text: "@dominic",
					url: "https://social.linux.pizza/@dominicwrege",
					icon: MastodonIcon,
				},
				{
					text: "api@ladefuchs.app",
					url: "mailto:api@ladefuchs.app",
					icon: MailIcon,
				},
			],
		},
		{
			name: "SVEN",
			role: "Jungfuchs",
			imageSource: require("@assets/team/team_sven.jpeg"),
			links: [
				{
					text: "@hexer",
					url: "https://chaos.social/@svenraskin",
					icon: MastodonIcon,
				},
				{
					text: "",
					url: "",
					icon: MailIcon,
				},
			],
		},
		{
			name: "RODDI",
			role: "iOSfuchs",
			imageSource: require("@assets/team/team_roddi.jpg"),
			links: [
				{
					text: "@roddi",
					url: "https://mastodon.social/@roddi",
					icon: MastodonIcon,
				},
				{
					text: "",
					url: "",
					icon: MailIcon,
				},
			],
		},
		{
			name: "THORSTEN",
			role: "Androidfuchs",
			imageSource: require("@assets/team/team_thorsten.jpg"),
			links: [
				{
					text: "",
					url: "",
					icon: MastodonIcon,
				},
				{
					text: "android@ladefuchs.app",
					url: "mailto:android@ladefuchs.app",
					icon: MailIcon,
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
						{member.links.map((line, idx) =>
							line.text && line.url ? (
								<TouchableWithoutFeedback
									key={idx}
									onPress={async () =>
										await Linking.openURL(line.url)
									}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<line.icon
											width={20}
											height={20}
											style={{
												marginRight: 5,
											}}
										/>
										<Text
											style={{
												fontFamily: "Bitter",
												fontSize: 15,
												lineHeight: 20,
												paddingVertical: 3,
											}}
										>
											{line.text}
										</Text>
									</View>
								</TouchableWithoutFeedback>
							) : null
						)}
					</View>
				</View>
			))}
		</>
	);
}
