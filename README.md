![fuchs](https://github.com/user-attachments/assets/9ebc8045-7652-4389-a7c9-f49233d35c57)

# Ladefuchs Mobile

<table>
  <thead>
  <th>Written in</th>
  <th>Available at</th>
  <th>Licensed with</th>
  </thead>
  <td>
    <img alt="typescript" src="https://img.shields.io/badge/-typescript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  </td>
  <td>
    <img alt="appstore" src="https://img.shields.io/badge/-AppStore-0D96F6?style=flat-square&logo=appstore&logoColor=white" />
    <img alt="googleplay" src="https://img.shields.io/badge/-GooglePlay-414141?style=flat-square&logo=googleplay&logoColor=white" />
    <img alt="fdroid" src="https://img.shields.io/badge/-FDroid-1976D2?style=flat-square&logo=fdroid&logoColor=white" />
  </td>
  <td>
    <img alt="apache" src="https://img.shields.io/badge/-Apache2-D22128?style=flat-square&logo=apache&logoColor=white" />
  </td>
</table>

Ladefuchs is an open-source app that compares charging tariffs inside Germany depending on the charging-station you are currently standing at. Ladefuchs is a non-profit application and organisation that aims for making electric mobility more accessible to a broader userbase by adopting well-known patterns.

Ladefuchs is available on

- [Apple iOS App Store](https://apps.apple.com/de/app/ladefuchs/id1522882164)
- [Google Android Play Store](https://play.google.com/store/apps/details?id=app.ladefuchs.android)
- [F-Droid](https://f-droid.org/de/packages/app.ladefuchs.android/) - Metadata at https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/app.ladefuchs.android.yml

## How to run and execute locally

> [!IMPORTANT]
> In order to run and use this application locally you need request a valid API_TOKEN.

### Setup your local toolchain.

```bash
// Install necessary tooling
npm install
npm run license

// Create / Update local .env file to supply API_TOKEN
API_TOKEN=12xxxxxxxxxxx
```

### Run the app

| iOS                                           | Android                                               | Expo            |
| --------------------------------------------- | ----------------------------------------------------- | --------------- |
| `npm run ios`<br />or<br />`npx expo run:ios` | `npm run android`<br />or<br />`npx expo run:android` | `npm run start` |

**Android**: You need to have Android Studio installed and configure the following environment variables:

```sh
# export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
# export ANDROID_HOME=$HOME/Library/Android/sdk
```

**iOS**: You need a Mac for iOS developement with Xcode installed.

## How to build the app

```bash
npm run build
```

## Android APK

```bash
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

## Packages

- [Expo App Router](https://docs.expo.dev/router/create-pages/)
- [React Navigation](https://reactnavigation.org/docs/header-buttons)

- [React Native UI](https://reactnativeelements.com/)
- [React Native Picker](https://github.com/react-native-picker/picker)

### F-droid packaging instructions

- [fastlane/metadata/android/] should be up to date (especially `/changelogs/` in `/de-DE/` and `/en-US/`)
- Create a tag with a pattern "X.Y.Z"
- Check https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/app.ladefuchs.android.yml which should automatically update
- If any problems, open a GitLab Merge Request (see https://gitlab.com/fdroid/fdroiddata/-/merge_requests/15604 for example)
- The automatic build procedure can take a while, check https://monitor.f-droid.org/builds/build
