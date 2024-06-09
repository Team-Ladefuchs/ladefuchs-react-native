import { View, Text } from "react-native";
import { colors } from "../../theme";
import { CloseButton } from "../header/closeButton";
import { Tariff } from "../../types/tariff";

interface Props {
	tariff: Tariff;
	navigation: { goBack: () => void };
}

export function DetailHeader({ tariff, navigation }: Props): JSX.Element {
	return (
		<View
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "row",
				paddingVertical: 16,
				paddingHorizontal: 16,
				backgroundColor: colors.ladefuchsDunklerBalken,
				borderBottomWidth: 0.5,
				borderBottomColor: colors.ladefuchsLightGrayBackground,
			}}
		>
			<View
				style={{
					flex: 1,
					columnGap: 10,
				}}
			>
				<Text
					style={{
						fontSize: 23,
						fontWeight: "bold",
					}}
				>
					{tariff.name}
				</Text>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
					}}
				>
					{tariff.providerName}
				</Text>
			</View>
			<View>
				<CloseButton onPress={() => navigation.goBack()} />
			</View>
		</View>
	);
}
