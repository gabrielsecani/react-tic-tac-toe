import * as firebase from 'firebase';

const prodConfig = {
  apiKey: "AIzaSyBhJnLhqv6BPlo9whTgE3sRvNn75CmV-LA",
  authDomain: "tic-tac-toe-195701.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-195701.firebaseio.com",
  projectId: "tic-tac-toe-195701",
  storageBucket: "tic-tac-toe-195701.appspot.com",
  messagingSenderId: "621638425292",
};
const devConfig = {
  apiKey: "AIzaSyBhJnLhqv6BPlo9whTgE3sRvNn75CmV-LA",
  authDomain: "tic-tac-toe-195701.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-195701.firebaseio.com",
  projectId: "tic-tac-toe-195701",
  storageBucket: "tic-tac-toe-195701.appspot.com",
  messagingSenderId: "621638425292",
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

// const firebaseApp = firebase.initializeApp(config);
var firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(config);
}else{
  firebaseApp = firebase.apps[0];
}

const firebaseAuth = firebase.auth();

const firebaseDb = firebase.database();

export {
  firebaseApp,
  firebaseAuth,
  firebaseDb,
};