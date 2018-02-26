import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const config = {
  apiKey: "AIzaSyBhJnLhqv6BPlo9whTgE3sRvNn75CmV-LA",
  authDomain: "tic-tac-toe-195701.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-195701.firebaseio.com",
  projectId: "tic-tac-toe-195701",
  storageBucket: "tic-tac-toe-195701.appspot.com",
  messagingSenderId: "621638425292"
};

const firebaseApp = firebase.initializeApp(config);

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccess: () => false,
    },
  };
  
  state = {
    signedIn: false
  };
  
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({signedIn: !!user});
    });
  }

  render() {
    if(this.props.onAuthStateChanged) this.props.onAuthStateChanged(firebaseApp);
    return (
    <div>
        {this.state.signedIn && 
          <div>
            Hello {firebaseApp.auth().currentUser.displayName}. You are signed In!
            <a className="button" onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
          </div>
        }
        {!this.state.signedIn && firebaseApp &&
          <div>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
          </div>
        }
    </div>
    )
  }
}

export default SignInScreen;