import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.png';
import Game from './game/Game';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tic Tac Toe</h1>
        </header>
        <p className="App-intro">
          To get started, set your name and click start, 
          <br/>then just wait for play come in and have fun.
        </p>
        <section className="App-Settings">
          <p>
            <label htmlFor="name">User name: </label>
            <input value={this.state.username} onChange={() => this.setState({name:this.value})}  id="name" />
          </p>
        </section>
        <Game />
      </div>
    );
  }
}

export default App;
