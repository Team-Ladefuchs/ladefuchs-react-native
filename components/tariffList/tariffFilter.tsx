import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { FavoriteCheckbox } from "../shared/favoriteCheckbox";
import { colors } from "@theme";
import { Checkbox } from "../shared/checkBox";
import i18n from "@translations/translations";

export type FilterType = "all" | "active" | "favorite" | "activeOrFavorite";

interface Props {
	onFilterChanged: (value: FilterType) => void;
}

export function TariffFilter({ onFilterChanged }: Props): JSX.Element {
	const [activeFilterCheckd, setActiveFilterCheckd] = useState(false);
	const [favoriteChecked, serFavoriteChecked] = useState(false);

	useEffect(() => {
		if (activeFilterCheckd && favoriteChecked) {
			onFilterChanged("activeOrFavorite");
		} else if (activeFilterCheckd) {
			onFilterChanged("active");
		} else if (favoriteChecked) {
			onFilterChanged("favorite");
		} else {
			onFilterChanged("all");
		}
	}, [activeFilterCheckd, favoriteChecked]);

	const handleActiveChanged = (value: boolean): void => {
		setActiveFilterCheckd(value);
	};

	const handleFaoriteChanged = (value: boolean): void => {
		serFavoriteChecked(value);
	};

	return (
		<View style={style.container}>
			<View style={style.innerContainer}>
				<Text style={[style.tariffilterText]} allowFontScaling={false}>
					{i18n.translate("tariffFilter")}
				</Text>
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
					<Text style={style.filterText} allowFontScaling={false}>
						{i18n.translate("activeTariffs")}
					</Text>
				</Pressable>
			</View>
			<View style={style.innerContainer}>
				<FavoriteCheckbox
					size={29}
					style={{ marginBottom: scale(2) }}
					checked={favoriteChecked}
					onValueChange={handleFaoriteChanged}
				/>
				<Pressable
					onPress={() => {
						handleFaoriteChanged(!favoriteChecked);
					}}
				>
					<Text style={style.filterText} allowFontScaling={false}>
						{i18n.translate("favorites")}
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
		gap: "12@s",
	},
	innerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "6@s",
	},
	filterText: {
		textTransform: "uppercase",
		color: colors.ladefuchsGrayTextColor,
		fontSize: "13@s",
		fontFamily: "RobotoCondensed",
	},
	tariffilterText: {
		textTransform: "uppercase",
		color: "black",
		fontSize: "13@s",
		marginRight: "8@s",
		fontFamily: "RobotoCondensed",
	},
});
