import { NativeModules, Platform } from "react-native";

const { InfoModule } = NativeModules;

interface InfoModuleInterface {
  openSettings: () => Promise<boolean>;
  showLocationPermissionHint: () => Promise<boolean>;
  setAPIKey: (apiKey: string) => Promise<boolean>;
  setSimulatorMode: (useSimulator: boolean) => Promise<boolean>;
  showHelloWorld: () => Promise<boolean>;
}

export const infoModule: InfoModuleInterface | null =
  InfoModule ? InfoModule : null;

export const openSettings = async (): Promise<void> => {
  if (!infoModule) {
    console.warn("InfoModule ist nicht verfügbar");
    return;
  }
  try {
    await infoModule.openSettings();
  } catch (error) {
    console.error("Fehler beim Öffnen der Settings:", error);
  }
};

export const showLocationPermissionHint = async (): Promise<void> => {
  if (!infoModule) {
    console.warn("InfoModule ist nicht verfügbar");
    return;
  }
  try {
    await infoModule.showLocationPermissionHint();
  } catch (error) {
    console.error("Fehler beim Anzeigen des Standortfreigabe-Hinweises:", error);
  }
};

export const setElvahAPIKey = async (apiKey: string): Promise<void> => {
  if (!infoModule) {
    console.warn("InfoModule ist nicht verfügbar");
    return;
  }
  const trimmedKey = apiKey?.trim() || "";
  if (!trimmedKey) {
    throw new Error("API-Key darf nicht leer sein");
  }
  try {
    console.log("setElvahAPIKey: Übergebe API-Key an Native Module...");
    console.log("setElvahAPIKey: API-Key Länge:", trimmedKey.length);
    await infoModule.setAPIKey(trimmedKey);
    console.log("elvah API-Key erfolgreich gesetzt");
  } catch (error) {
    console.error("Fehler beim Setzen des API-Keys:", error);
    console.error("API-Key Details:", {
      length: trimmedKey.length,
      start: trimmedKey.substring(0, 10),
      isEmpty: trimmedKey === "",
    });
    throw error;
  }
};

export const setElvahSimulatorMode = async (useSimulator: boolean): Promise<void> => {
  if (!infoModule) {
    console.warn("InfoModule ist nicht verfügbar");
    return;
  }
  try {
    console.log(`setElvahSimulatorMode: ${useSimulator ? "Aktiviere" : "Deaktiviere"} Simulator-Modus...`);
    await infoModule.setSimulatorMode(useSimulator);
    console.log(`elvah Simulator-Modus ${useSimulator ? "aktiviert" : "deaktiviert"}`);
  } catch (error) {
    console.error("Fehler beim Setzen des Simulator-Modus:", error);
    throw error;
  }
};

export const showHelloWorld = async (): Promise<void> => {
  if (!infoModule) {
    console.warn("InfoModule ist nicht verfügbar");
    return;
  }
  try {
    await infoModule.showHelloWorld();
  } catch (error) {
    console.error("Fehler beim Anzeigen von Hallo Welt:", error);
  }
};

