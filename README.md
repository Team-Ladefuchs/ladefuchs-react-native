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
