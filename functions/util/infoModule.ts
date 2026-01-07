import { NativeModules, Platform } from "react-native";

const { InfoModule } = NativeModules;

interface InfoModuleInterface {
  openSettings: () => Promise<boolean>;
  showLocationPermissionHint: () => Promise<boolean>;
  setAPIKey: (apiKey: string) => Promise<boolean>;
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
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API-Key darf nicht leer sein");
  }
  try {
    await infoModule.setAPIKey(apiKey);
    console.log("elvah API-Key erfolgreich gesetzt");
  } catch (error) {
    console.error("Fehler beim Setzen des API-Keys:", error);
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

