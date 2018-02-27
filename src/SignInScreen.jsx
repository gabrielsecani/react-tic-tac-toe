import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseApp = this.props.firebaseApp;
    // if (!this.firebaseApp) 
    // throw DOMException("asda");
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
    this.firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({signedIn: !!user});
    });
  }

  render() {
    if(this.props.onAuthStateChanged) this.props.onAuthStateChanged(this.firebaseApp);
    return (
    <div>
        {this.state.signedIn && 
          <div>
            Hello {this.firebaseApp.auth().currentUser.displayName}. You are signed In!
            <a className="button" onClick={() => this.firebaseApp.auth().signOut()}>Sign-out</a>
          </div>
        }
        {!this.state.signedIn && this.firebaseApp &&
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