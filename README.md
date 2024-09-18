## How to install

```sh
npm install
npm run eula
```

## Create .env file

```
API_TOKEN=12xxxxxxxxxxx

```

## How to build

## Prebuilt

```sh
npm run build
```

## Android APK

```sh
npx expo prebuild --clean

cd android

./gradlew assembleRelease

```

## How to run

### iOS

```sh
# run
npm run ios
# or
npx expo run:ios
```

### Android

Set up your environment

1. Install Android Studio
2. Set these env variables

```sh
# export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
# export ANDROID_HOME=$HOME/Library/Android/sdk
```

```sh
# run
npm run android
# or
npx expo run:android
```

## Packages

- [Expo App Router](https://docs.expo.dev/router/create-pages/)
- [React Navigation](https://reactnavigation.org/docs/header-buttons)

- [React Native UI](https://reactnativeelements.com/)
- [React Native Picker](https://github.com/react-native-picker/picker)


## Availability

Ladefuchs is available on 
* [Apple iOS App Store](https://apps.apple.com/de/app/ladefuchs/id1522882164)
* [Google Android Play Store](https://play.google.com/store/apps/details?id=app.ladefuchs.android)
* [F-Droid](https://f-droid.org/de/packages/app.ladefuchs.android/) - Metadata at https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/app.ladefuchs.android.yml


### F-droid packaging instructions
* [fastlane/metadata/android/] should be up to date (especially `/changelogs/` in `/de-DE/` and `/en-US/`)
* Create a tag with a pattern "X.Y.Z"
* Check https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/app.ladefuchs.android.yml which should automatically update
* If any problems, open a GitLab Merge Request (see https://gitlab.com/fdroid/fdroiddata/-/merge_requests/15604 for example)
* The automatic build procedure can take a while, check https://monitor.f-droid.org/builds/build