import AsyncStorage from "@react-native-async-storage/async-storage";

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
