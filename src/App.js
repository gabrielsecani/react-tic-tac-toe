import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.png';
import './App.css';
import { routes, SwitchRouting } from './constants/routes';
import { Link } from 'react-router-dom';

import SignInScreen from './components/SignInScreen';
import { firebaseAuth } from './components/Fire';

const MenuList = () => (
  <ul>
    {routes.filter(r => !!r.display).map((r, i) => (
      <li key={i.toString()} ><Link to={r.path}>{r.display}</Link>
        {r.routes ? (
          <ul>{r.routes.map((c, j) => (<li key={i.toString() + j.toString()}><Link to={r.path + '/' + c.path}> {c.display}</Link></li>))}</ul>
        ) : ''}
      </li>
    ))}
  </ul>
);

class AppHeader extends Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Tic Tac Toe Game App</h1>
        <h5>Version: 0.1.2</h5>
        <nav>
          <MenuList />
        </nav>
        <section className="App-login">
          <SignInScreen firebaseAuth={firebaseAuth} />
        </section>
      </header>
    );
  }
}

const NoAuth = () => (<section className="App-intro">Please do login then please have a sit and have fun!</section>);

class App extends Component {
  render() {
    return (<div>
      {(!!!firebaseAuth.currentUser) ? <SwitchRouting AppHeader={AppHeader} /> : <NoAuth />}
    </div>);
  }
}

export default App;
