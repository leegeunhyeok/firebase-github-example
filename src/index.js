import firebase from 'firebase/app';
// Add this line if you enabled Google Analytics.
// import 'firebase/analytics';

class App {
  constructor() {
    this._state = {
      token: null,
      username: null,
    };

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

    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');
    this._provider = provider;
  }

  login() {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ credential, user }) => {
        this._state.token = credential.accessToken; // GitHub access token
        this._state.username = user.username; // GitHub username
        console.log(user);
      })
      .catch((e) => {
        console.error(e);
        alert(`${e.code}: ${e.message}`);
      });
  }

  getUserInformation() {
    return new Promise((resolve, reject) => {
      if (this._state.token) {
        // TODO: Load user information from GitHub API
      } else {
        reject('Not authorized');
      }
    });
  }
}

const app = new App();

window.onload = () => {
  document.getElementById('#login').addEventListener('click', () => {
    app.login();
  });
};
