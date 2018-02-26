import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.png';
import Loadable from 'react-loadable';
import './App.css';
import LoadingComponent from './LoadingComponent';
import SignInScreen from './Fire';

const LoadableGame = Loadable({
  loader: () => import('./game/Game'),
  loading: LoadingComponent,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      boardSize: 3,
    };
  }

  handleUsername(event){
    if(!this.state.username)
      this.setState({username: event.target.value});
  }

  handleBoardSizeChange(event) {
    console.log(this, event);
    this.setState({boardSize: parseInt(event.currentTarget.value, 10)})
  }
  handleAuthStateChange(user) {
    console.log('auth change:',user);

    // if (user&&user.auth()){
    //   this.setState({username: user.auth().displayName});
    // }
  }

  render() {
    //console.log(this, firebase.auth().currentUser.displayName);
    return (<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tic Tac Toe App</h1>
        <section className="App-login">
          <SignInScreen onAuthStateChanged={this.handleAuthStateChange.bind(this)}/>
        </section>
        </header>
        <section className="App-intro">
        <div>
          To get started, search for a match or
          <br/>just start one and have fun.
        </div>
        </section>
        <section className="App-Settings">
          {/* <p>
            <label htmlFor="name">User name: </label>
            <input value={this.state.username} onChange={this.handleUsername.bind(this)} name="username" />
          </p> */}
          <p>
            <label htmlFor="boardsize">Select board size: </label>
            <select name="boardsize" onChange={this.handleBoardSizeChange.bind(this)}>{
              Array(4).fill(3).map((v,i)=>v+i*2).map(number=>(
                <option key={number.toString()} value={number}>{number}</option>
            ))}</select>
          </p>
        </section>
        <section className="App-Game">
          <LoadableGame boardSize={this.state.boardSize}/>
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
