import AsyncStorage from "@react-native-async-storage/async-storage";

export async function resetOnboarding() {
	try {
		await AsyncStorage.removeItem("alreadyLaunched"); // Löscht die Markierung
	} catch (error) {
		console.error("Fehler beim Zurücksetzen des Onboardings", error);
	}
}

export async function getFirstOnboarding(): Promise<boolean> {
	const launched = await AsyncStorage.getItem("alreadyLaunched");
	if (!launched) {
		AsyncStorage.setItem("alreadyLaunched", "true");
		return true;
	}

	return false;
}
