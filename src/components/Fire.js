import * as firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: "tic-tac-toe-195701.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-195701.firebaseio.com",
  projectId: "tic-tac-toe-195701",
  storageBucket: "tic-tac-toe-195701.appspot.com",
  messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
};

// const firebaseApp = firebase.initializeApp(config);
var firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(config);
} else {
  firebaseApp = firebase.apps[0];
}

const firebaseAuth = firebase.auth();

const firebaseDb = firebase.database();

export {
  firebaseApp,
  firebaseAuth,
  firebaseDb,
};