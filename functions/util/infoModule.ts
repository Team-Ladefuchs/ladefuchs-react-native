import { NativeModules, Platform } from "react-native";

const { InfoModule } = NativeModules;

interface InfoModuleInterface {
  openSettings: () => Promise<boolean>;
  showHelloWorld: () => Promise<boolean>;
}

export const infoModule: InfoModuleInterface | null =
  Platform.OS === "ios" && InfoModule ? InfoModule : null;

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

