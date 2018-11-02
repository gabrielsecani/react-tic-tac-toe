import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import UserAPI from './Game/api/UserAPI';

class UserName extends Component {
  constructor(props) {
    super(props);
    this.firebaseAuth = props.firebaseAuth;
  }

  state = {
    editUserName: false,
  }

  changeUserName(e) {
    console.log(e);
    this.setState({ name: e.target.value });
  }

  openEdit() {
    this.setState({
      editUserName: true,
      name: this.firebaseAuth.currentUser.displayName,
    });
  }

  closeEdit(e) {
    e.preventDefault();

    const profile = { displayName: this.state.name };

    this.firebaseAuth.currentUser.updateProfile(profile)
      .then(() =>
        UserAPI.setUserState({
          name: profile.displayName,
          photoURL: this.firebaseAuth.currentUser.photoURL,
        }).then(() =>
          this.setState({ editUserName: false })
        )
      )
      .catch(error => {
        // An error occured
        console.error(error);
        alert(error);
      });
  }

  componentDidMount() {
    if (!!this.props.editUserName)
      this.setState({ editUserName: this.props.editUserName });
  }

  render() {
    if (this.state.editUserName) {
      return (
        <form onSubmit={this.closeEdit.bind(this)} >
          <input onBlur={this.closeEdit.bind(this)} type="text" name="displayName" placeholder="Your name" pattern="[A-Za-z0-9æÆøØåÅ]{3,30}" required autoFocus
            onChange={(e) => this.setState({ name: e.target.value })}
            value={this.state.name} />
        </form>)
    } else {
      return (<span onClick={() => this.openEdit()}>{this.state.name || "(click here to change)"}</span>)
    }
  }
}

class AnonyButton extends Component {

  constructor(props) {
    super(props);
    this.firebaseAuth = props.firebaseAuth;
    if (props.hasOwnProperty('loginAnonymous'))
      Object.assign(this.state, { loginAnonymous: props.loginAnonymous });
  }
  state = {
    name: '',
    loginAnonymous: false
  }

  signIn() {
    this.setState({ loginAnonymous: true });
  }

  signAnonymous(e) {
    e.preventDefault();
    const profile = { displayName: this.state.name };
    this.firebaseAuth.signInAnonymouslyAndRetrieveData()
      .then((u) => {
        u.user.updateProfile(profile)
          .then(() =>
            UserAPI.setUserState({
              name: profile.displayName
            }))
      })
  }

  render() {
    if (!this.state.loginAnonymous) {
      return <div><p>Please sign-in:</p>
        <button className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-text firebaseui-id-idp-button"
          data-provider-id="anonymous" data-upgraded="MaterialButton" onClick={this.signIn.bind(this)}>
          <span className="firebaseui-idp-icon-wrapper">
            <img className="firebaseui-idp-icon" alt="anonymous login" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" />
          </span>
          <span className="firebaseui-idp-text firebaseui-idp-text-long colorblack">Sign in Anonymous</span>
          <span className="firebaseui-idp-text firebaseui-idp-text-short colorblack">Anonymous</span>
        </button>
      </div>
    } else {
      return <div><p>Please, tell me your name:</p>
        <form onSubmit={this.signAnonymous.bind(this)} >
          <p><input type="text" name="displayName" placeholder="Your user name" pattern="[A-Za-z0-9æÆøØåÅ]{3,30}" required autoFocus
            onChange={(e) => this.setState({ name: e.target.value })}
            value={this.state.name} /></p>
          <button type="submit" className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-text firebaseui-id-idp-button"
            data-provider-id="anonymous" data-upgraded="MaterialButton" >
            <span className="firebaseui-idp-icon-wrapper">
              <img className="firebaseui-idp-icon" alt="anonymous login" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" />
            </span>
            <span className="firebaseui-idp-text firebaseui-idp-text-long colorblack">Go! Sign In</span>
            <span className="firebaseui-idp-text firebaseui-idp-text-short colorblack">Anonymous</span>
          </button>
        </form>
      </div >
    }
  }
}

class SignInScreen extends Component {

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Whether the display name should be displayed in the Sign Up page.
        requireDisplayName: true
      },
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // Invisible reCAPTCHA with image challenge and bottom left badge.
        recaptchaParameters: {
          type: 'image',
          size: 'invisible',
          badge: 'bottomleft'
        }
      }
    ],

    callbacks: {
      signInSuccessWithAuthResult: (auth) => {
        UserAPI.setUserState({
          name: this.firebaseAuth.currentUser.displayName,
          photoURL: this.firebaseAuth.currentUser.photoURL,
        }).then(() =>
          this.setState({ editUserName: false })
        )
      },
    },
  };

  state = {
    signedIn: false,
    loginAnonymous: false
  };

  componentWillMount() {
    if (!this.props.firebaseApp && !this.props.firebaseAuth) {
      throw new DOMException('SignInScreen: You might set at least one of firebaseApp or firebaseAuth properties.');
    }
    this.firebaseApp = this.props.firebaseApp;
    this.firebaseAuth = this.props.firebaseAuth || this.firebaseApp.auth();
    if (!!this.firebaseApp || this.firebaseApp !== this.firebaseAuth.app) this.firebaseApp = this.firebaseAuth.app;

    this.firebaseAuth.onAuthStateChanged((user) => {
      this.setState({ signedIn: !!user });
    });
  }

  render() {
    if (this.props.onAuthStateChanged) this.props.onAuthStateChanged(this.firebaseApp);

    return (
      <div>
        {this.state.signedIn &&
          <div>
            Hello <UserName firebaseAuth={this.firebaseAuth} />!<br />
            <button className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-text firebaseui-id-idp-button colorblack"
              onClick={() => window.confirm("Why do you want go away? Do you sure?") && this.firebaseAuth.signOut()}>
              <span className="firebaseui-idp-text colorblack">Sign out</span>
            </button>
          </div>}
        {!this.state.signedIn && this.firebaseApp &&
          <div>
            <AnonyButton firebaseAuth={this.firebaseAuth} loginAnonymous={this.state.loginAnonymous} />
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.firebaseAuth} autoUpgradeAnonymousUsers="true" />
          </div>
        }
      </div>
    )
  }
}

export default SignInScreen;