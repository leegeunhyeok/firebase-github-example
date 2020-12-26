# Firebase & GitHub OAuth example

GitHub OAuth for Web

> No Server, No Payment

## Preview

<img src="images/preview_1.png" width="500">
<img src="images/preview_2.png" width="500">
<img src="images/preview_3.png" width="500">

## 1. Create New GitHub OAuth application

Go to `Settings > Developer settings`

<img src="images/1.png">

<img src="images/2.png">

Fill the blanks.

- Fill any address to callback URL field (TODO: update to Firebase oauth callback URL)

<img src="images/3.png">

## 2. Copy GitHub application tokens

- `Client ID`, `Client secrets (Generate new secret)`

<img src="images/4.png">

## 3. Create Firebase project

- [Firebase Console](https://console.firebase.google.com)
- Require: Google Account

<img src="images/5.png">

## 4. Configuration Firebase project

Go to `Project settings`

<img src="images/6.png">

and create new web app

<img src="images/7.png">

finally, copy `firebase config values`.

<img src="images/8.png">

## 5. Configuration Firebase authentication

Go to `Authentication` menu

<img src="images/9.png">

Find GitHub method and fill the blanks

- GitHub `Client ID` and `secret`

and copy `accept callback URL`

<img src="images/10.png">

## 6. Update GitHub application

Replace to Firebase callback URL

<img src="images/11.png">

## 7. Core code example

```bash
npm install --save firebase
```

- Check `src/index.js`

```js
import firebase from 'firebase/app';
import 'firebase/auth';
// Add this line if you enabled Google Analytics.
// import 'firebase/analytics';

// ...

// Your config
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

// Firebase initialization
firebase.initializeApp(firebaseConfig);
// Add this line if you enabled Google Analytics.
// firebase.analytics();
```

```js
const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');

firebase
  .auth()
  .signInWithPopup(provider)
  .then(({ credential }) => {
    credential.accessToken; // GitHub access token
  })
  .catch((e) => {
    // Error
  });
```
