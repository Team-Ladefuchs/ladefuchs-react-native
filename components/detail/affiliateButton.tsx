import { SafeAreaView, Linking } from "react-native";
import React from "react";
import { LadefuchsButton } from "./ladefuchsButton";

export function AffiliateButton({
	link,
}: {
	link: string | null | undefined;
}): JSX.Element {
	if (!link) {
		return <></>;
	}
	return (
		<SafeAreaView style={{ marginTop: "auto", marginHorizontal: 16 }}>
			<LadefuchsButton
				text="Hol dir die Karte!"
				onPress={async () => await Linking.openURL(link)}
			/>
		</SafeAreaView>
	);
}
