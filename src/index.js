import firebase from 'firebase/app';
import 'firebase/auth';
// Add this line if you enabled Google Analytics.
// import 'firebase/analytics';

import axios from 'axios';

class App {
  constructor() {
    this._state = {
      token: null,
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
    this._loadToken();
    this._init();
  }

  _init() {
    this._state.token &&
      this.getUser()
        .then((username) => this.getRepositoryList(username))
        .then((repositoryList) => this.renderList(repositoryList));
  }

  _saveToken(token) {
    localStorage.setItem('token', token);
    this._state.token = token;
  }

  _loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this._state.token = token;
    }
  }

  _clearToken() {
    localStorage.removeItem('token');
  }

  isAuthorized() {
    return !!this._state.token;
  }

  login() {
    return firebase
      .auth()
      .signInWithPopup(this._provider)
      .then(({ credential }) => {
        this._saveToken(credential.accessToken); // GitHub access token
        this._init();
      })
      .catch((e) => {
        console.error(e);
        alert(`${e.code}: ${e.message}`);
      });
  }

  logout() {
    this._clearToken();
    this.showContent(false);
  }

  getUser() {
    return axios
      .get('https://api.github.com/user', {
        headers: {
          accept: 'application/vnd.github.v3+json',
          Authorization: `token ${this._state.token}`,
        },
      })
      .then(({ data }) => data.login);
  }

  getRepositoryList(username) {
    return axios
      .get(
        `https://api.github.com/users/${username}/repos?sort=updated&page=1&per_page=10`,
        {
          headers: {
            accept: 'application/vnd.github.v3+json',
            Authorization: `token ${this._state.token}`,
          },
        },
      )
      .then(({ data }) =>
        data.map(({ full_name, html_url, description, stargazers_count }) => ({
          name: full_name,
          url: html_url,
          description,
          star: stargazers_count,
        })),
      )
      .catch((e) => {
        console.error(e);
        alert(e.message);
      });
  }

  renderList(repositoryList) {
    const target = document.getElementById('content');
    target.innerHTML = '';
    repositoryList.forEach(({ name, url, description, star }) => {
      target.innerHTML += `
        <div class="hoverable">
          <a href="${url}">
            <h4>${name}</h4>
            <span>Star: ${star}</span>
            <p>${description || 'No descritption'}</p>
          </a>
        </div>
      `;
    });

    this.showContent(true);
  }

  showContent(show) {
    document.getElementById('signin').style = `display:${
      show ? 'none' : 'block'
    }`;
    document.getElementById('content').style = `display:${
      show ? 'block' : 'none'
    }`;
    document.getElementById('logout').style = `display:${
      show ? 'block' : 'none'
    }`;
  }
}

const app = new App();

window.onload = () => {
  if (app.isAuthorized()) {
    app.showContent(true);
  }

  // Login button
  document.getElementById('login').addEventListener('click', () => {
    app.login();
  });

  // Logout button
  document.getElementById('logout').addEventListener('click', () => {
    app.logout();
  });
};
