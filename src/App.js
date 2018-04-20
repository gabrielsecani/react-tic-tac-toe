import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.png';
import './App.css';
import { routes, SwitchRouting } from './constants/routes';
import { Link } from 'react-router-dom';

import SignInScreen from './components/SignInScreen';
import { firebaseAuth } from './components/Fire';

function MenuList(props){
  const routes=props.routes;
  return (
    <ul>
    {routes.filter(r=>!!r.display).map((r,i)=>(
      <li key={i.toString()} ><Link to={r.path}>{r.display}</Link>
      {r.routes?(
        <ul>{r.routes.map((c,j)=>(<li key={i.toString()+j.toString()}><Link to={r.path+'/'+c.path}> {c.display}</Link></li>))}</ul>
      ): ''}
      </li>
    ))}
  </ul>);
}

class AppHeader extends Component {  
  handleAuthStateChange(user) {
    // console.log('auth change:', user, firebaseAuth);
    // this.setState({user});
  }

  render() {
    return (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tic Tac Toe App</h1>
          <nav>
            <MenuList routes={routes}/>
          </nav>
          <section className="App-login">
            <SignInScreen firebaseAuth={firebaseAuth} onAuthStateChanged={this.handleAuthStateChange.bind(this)}/>
          </section>
        </header>
    );
  }
}

const NoAuth=()=>(<section className="App-intro">Please do login so have a sit with and have fun!</section>);

class App extends Component {
  render() {
    return (<div>
      { (!!!firebaseAuth.currentUser)? <SwitchRouting AppHeader={AppHeader}/> : <NoAuth/> }
    </div>);
  }
}

export default App;
