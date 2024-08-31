import { useFonts } from "expo-font";

export function useCustomFonts(): boolean {
	const [loaded] = useFonts({
		Bitter: require("@assets/fonts/Bitter-Italic.ttf"),
		Roboto: require("@assets/fonts/Roboto-Bold.ttf"),
		RobotoCondensed: require("@assets/fonts/Roboto-Condensed-Bold.ttf"),
	});

	return loaded;
}
