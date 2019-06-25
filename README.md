
# LaneChange

LaneChange is an app for iOS and Android that reports mobility issues (blocked bike lanes, obstructed sidewalks etc) to your city hall. It was originally written in React Native in June 2019 by Solodigitalis & `@screenthink` for `#bikeMonth`.

## Screens

 Start | Report | Notes | Done 
--- | --- | --- | ---
![Screenshot 1](https://github.com/xaphod/LaneChange/raw/master/readme_assets/01.png) | ![Screenshot 2](https://github.com/xaphod/LaneChange/raw/master/readme_assets/02.png) | ![Screenshot 3](https://github.com/xaphod/LaneChange/raw/master/readme_assets/03.png) | ![Screenshot 4](https://github.com/xaphod/LaneChange/raw/master/readme_assets/04.png) |

## Installation

### Client

You'll need all the usual things a React Native project requires: head over to [the official React Native page](https://facebook.github.io/react-native/) to figure out what that means today. Short version: in addition to `node` and `npm` you'll need `XCode` and `cocoapods` if you want to run iOS builds, and an Android emulator plus a JDK if you want to run Android (easiest way: Android Studio full install).

Recommended approach if you're setting this up for the first time: use the _React Native CLI Quickstart_ and follow the steps there. Avoid `Expo`, you do not want this.

From the repo folder:

```bash
brew install cocoapods # <-- if you don't have it already, this is using HomeBrew
npm install
cd ios && pod install
```

### Backend

Next, you need to create & configure a **Google Firebase backend** for the app to write its data in. This is free (you don't need a paid Firebase plan for this app). Head over to [Firebase](https://firebase.google.com), create a project, and turn on these modules:

 - **Authentication module**: go to the _Sign-in method_ tab and turn on both _Email/Password_ as well as _Anonymous_ sign-in. LaneChange currently uses Anonymous only.
 - **Database module**: enable FireStore, and 
   - manually create a collection called `cities` with at least one document (with any ID) that has properties `name` (the name of the city) and `email` (the email address to use). You can also enter an array of strings `otherNames` if the city is an amalgamation of other municipalities that might be returned during reverse-geocode
   - set the following in the _Rules_ tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	match /cities/{city} {
      allow read: if true;
      allow write: if false;
    }
    match /reports-testing/{report} {
      allow create: if request.auth.uid != null;
      allow read, list, update, delete: if request.auth.uid == resource.data.user;
    }
    match /reports/{report} {
      allow create: if request.auth.uid != null;
      allow read, list, update, delete: if request.auth.uid == resource.data.user;
    }
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```
 - **Storage module**: create a bucket

To wire up the client to the backend, you need to go to the Firebase _Project Overview_ -> _Project Settings_ and add two client apps (one iOS, one Android). Then you must download the two files from Firebase (on the same page where you created the client apps):

 - `google-services.json` - put this in `android/app/`
 - `GoogleService-Info.plist` - put this in `ios/Bike/`

### Google Geocode API

LaneChange uses the Google Geocode API. You can see this in `app/utils/location.js` where it fetches `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}`. You need to get an API key from Google, and either stick it in `app/utils/keys.js` or edit `location.js` accordingly.

You also need to use the Google Cloud Console to turn on the Geocoding and Geolocation APIs (possibly others -- if you get errors on geocoding, enable more Google mappy-map APIs until it works...)

## Usage

```bash
react-native run-android
react-native run-ios
```

## Contributing
Pull requests for bugs are welcome, but please file an issue also (preferably first). For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL-3.0](https://github.com/xaphod/LaneChange/blob/master/LICENSE)
