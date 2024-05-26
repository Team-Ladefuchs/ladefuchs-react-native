import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerType } from "../types/banner";

export async function getBannerType(): Promise<BannerType> {
	const key = "bannerType";
	const ladefuchsValue = "ladefuchs";
	const chargePriceValue = "chargePrice";

	try {
		const storedValue = (await AsyncStorage.getItem(key)) ?? ladefuchsValue;
		const showChargePriceBanner = storedValue === chargePriceValue;
		if (showChargePriceBanner) {
			await AsyncStorage.setItem(key, ladefuchsValue);
			return chargePriceValue;
		} else {
			await AsyncStorage.setItem(key, chargePriceValue);
			return ladefuchsValue;
		}
	} catch (_e) {}
	return ladefuchsValue;
}
