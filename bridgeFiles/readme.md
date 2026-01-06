Dateien aus dem iOS Ordner müssen vor dem kompilieren mit Xcode in den den root des Projekts kopiert werden
elvah SDK ins Projekt einbinden
	•	Swift Package Manager:
	•	In Xcode unter Package Dependencies das Git‑Repo  https://github.com/elvah-hub/charge-sdk-ios.git  hinzufügen.
	•	Das Produkt  ElvahCharge  in den Target‑Dependencies deiner App auswählen.
	•	Import im Code: In allen Dateien, in denen du das SDK nutzt,  import ElvahCharge  einfügen.

Android in app/src/main/java/app/ladefuchs/android