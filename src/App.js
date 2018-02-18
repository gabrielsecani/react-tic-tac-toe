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
      usernameRW: false,
    };
  }
  handleUsername(event){
    this.setState({username: event.target.value});
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
            <input value={this.state.username} onChange={this.handleUsername.bind(this)} id="username" />
          </p>
        </section>
        <section className="App-Game">
        <Game />
        </section>
        <section className="App-Rules">
          <p>The rules to win this game is one of above:</p>
          <ol>
            <li>fulfill one entire row</li>
            <li>fulfill one entire column</li>
            <li>fulfill one diagonal line</li>
          </ol>
        </section>
      </div>
    );
  }
}

export default App;
