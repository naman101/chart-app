# chart-app

To run a development android build:
1. Make sure you have react-native environment setup as stated in the docs
2. Install dependencies using `yarn install`
3. Run `yarn clean-debug`

To run a production android build:
1. Sign the app as given in: https://reactnative.dev/docs/signed-apk-android
2. Change the respective keys in gradle.properties
3. Run `yarn android-release`
