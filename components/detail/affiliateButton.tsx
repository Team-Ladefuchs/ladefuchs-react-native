import { SafeAreaView, Linking } from "react-native";
import React from "react";
import { LadefuchsButton } from "./ladefuchsButton";
import i18n from "@translations/translations";

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
				text={i18n.t("map")}
				onPress={async () => await Linking.openURL(link)}
			/>
		</SafeAreaView>
	);
}
