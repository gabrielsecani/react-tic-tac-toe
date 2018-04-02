import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    if(!this.props.firebaseApp && !this.props.firebaseAuth){
      throw new DOMException('SignInScreen: You need to set at least one of firebaseApp or firebaseAuth properties.');
    }
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
    this.firebaseApp = this.props.firebaseApp;
    this.firebaseAuth = this.props.firebaseAuth || this.firebaseApp.auth();
    if(!!this.firebaseApp||this.firebaseApp!==this.firebaseAuth.app) this.firebaseApp = this.firebaseAuth.app;
    this.firebaseAuth.onAuthStateChanged((user) => {
      this.setState({signedIn: !!user});
    });
  }

  render() {
    if(this.props.onAuthStateChanged) this.props.onAuthStateChanged(this.firebaseApp);
    return (
    <div>
        {this.state.signedIn && 
          <div>
            Hello {this.firebaseAuth.currentUser.displayName}. You are signed In!
            <a className="button" onClick={() => this.firebaseAuth.signOut()}>Sign-out</a>
          </div>
        }
        {!this.state.signedIn && this.firebaseApp &&
          <div>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.firebaseAuth}/>
          </div>
        }
    </div>
    )
  }
}

export default SignInScreen;