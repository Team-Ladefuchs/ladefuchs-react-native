import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { FavoriteCheckbox } from "../shared/favoriteCheckbox";
import { colors } from "../../theme";
import { Checkbox } from "../shared/checkBox";
import i18n from "../../localization";

export type FilterType = "all" | "active" | "onlyFavorite";

interface Props {
	onFilterChanged: (value: FilterType) => void;
}

// idea: maybe allow click via label?

export function TariffFilter({ onFilterChanged }: Props): JSX.Element {
	const [activeFilterCheckd, setActiveFilterCheckd] = useState(false);
	const [favoriteChecked, serFavoriteChecked] = useState(false);

	useEffect(() => {
		if (activeFilterCheckd && favoriteChecked) {
			onFilterChanged("onlyFavorite");
		} else if (activeFilterCheckd) {
			onFilterChanged("active");
		} else {
			onFilterChanged("all");
		}
	}, [activeFilterCheckd, favoriteChecked]);

	return (
		<View style={style.container}>
			<View style={style.innerContainer}>
				<View style={{ marginTop: scale(1) }}>
					<Checkbox
						size={scale(22)}
						checked={activeFilterCheckd}
						onValueChange={(value) => {
							if (!value) {
								serFavoriteChecked(value);
							}
							setActiveFilterCheckd(value);
						}}
					/>
				</View>
				<Text style={style.filterText}>
					{i18n.translate("aktiveTarife")}
				</Text>
			</View>
			<View style={style.innerContainer}>
				<FavoriteCheckbox
					checked={favoriteChecked}
					onValueChange={(value) => {
						if (value) {
							setActiveFilterCheckd(value);
						}
						serFavoriteChecked(value);
					}}
				/>
				<Text style={style.filterText}>
					{i18n.translate("favoriten")}
				</Text>
			</View>
		</View>
	);
}

const style = ScaledSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "10@s",
	},
	innerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "6@s",
	},
	filterText: {
		textTransform: "uppercase",
		fontWeight: "bold",
		color: colors.ladefuchsGrayTextColor,
		fontSize: scale(12),
	},
});
