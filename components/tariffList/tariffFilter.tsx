import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
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

	const handleActiveChanged = (value: boolean): void => {
		if (!value) {
			serFavoriteChecked(value);
		}
		setActiveFilterCheckd(value);
	};

	const handleFaoriteChanged = (value: boolean): void => {
		if (value) {
			setActiveFilterCheckd(value);
		}
		serFavoriteChecked(value);
	};

	return (
		<View style={style.container}>
			<View style={style.innerContainer}>
				<View style={{ marginTop: scale(1) }}>
					<Checkbox
						size={scale(22)}
						checked={activeFilterCheckd}
						onValueChange={handleActiveChanged}
					/>
				</View>
				<Pressable
					onPress={() => {
						handleActiveChanged(!activeFilterCheckd);
					}}
				>
					<Text style={style.filterText}>
						{i18n.translate("aktiveTarife")}
					</Text>
				</Pressable>
			</View>
			<View style={style.innerContainer}>
				<FavoriteCheckbox
					checked={favoriteChecked}
					onValueChange={handleFaoriteChanged}
				/>
				<Pressable
					onPress={() => {
						handleFaoriteChanged(!favoriteChecked);
					}}
				>
					<Text style={style.filterText}>
						{i18n.translate("favoriten")}
					</Text>
				</Pressable>
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
