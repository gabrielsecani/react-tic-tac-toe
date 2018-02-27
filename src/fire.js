import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBhJnLhqv6BPlo9whTgE3sRvNn75CmV-LA",
  authDomain: "tic-tac-toe-195701.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-195701.firebaseio.com",
  projectId: "tic-tac-toe-195701",
  storageBucket: "tic-tac-toe-195701.appspot.com",
  messagingSenderId: "621638425292",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { 
  firebaseConfig,
  firebaseApp
};