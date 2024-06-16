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
	} catch (error) {
		console.log("Could not get banner type from storage");
	}
	return ladefuchsValue;
}

export async function saveToStorage<T>(key: string, json: T) {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(json));
	} catch {}
}

export async function retrieveFromStorage<T>(key: string): Promise<T | null> {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch {
		return null;
	}
}
