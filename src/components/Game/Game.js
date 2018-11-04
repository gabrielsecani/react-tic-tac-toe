import React from 'react';
// import ReactDOM from 'react-dom';
import Board from './Board';
import './Game.css';
import GameAPI from './api/GameAPI';
import { firebaseAuth } from '../Fire';
import UserAPI, { UserState } from './api/UserAPI';

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.gameId = (this.props.match && this.props.match.params && this.props.match.params.id);
    this.online = !!this.gameId;

    this.options = {
      showHistory: true,
    };

    Object.assign(this.options, this.props, this.props.options);

    this.state = {
      history: [{
        squares: [false],
      }],
      stepNumber: 0,
      boardSize: 3,
    }
    this._INITIAL_state = this.state;

    // if (this.online||true) {
    this.local_setState = this.setState;
    this.setState = this.setGameState;
    // }

  }

  setGameState(stt, callback = null, local = false) {
    if (this.online && !local) {
      //update firebase and let it fire listener handle
      GameAPI.setGameState(Object.assign(this.state, stt))
        .then(() => {
          // console.log('Game.setGameState.then:done ',stt);
          this.setState(stt, callback, true);
        }, reason => {
          console.error("setGameState:", reason, stt);
          alert("setGameState:" + reason);
        });
    } else {
      if (callback) {
        this.local_setState(stt, callback);
      } else {
        this.local_setState(stt);
      }
    }
  }

  componentDidMount() {
    if (this.online) {
      const handle = v => {
        this.authUid = firebaseAuth.currentUser.uid;
        v = this.checkPlayers(v);

        if (!this.state.loaded_online) v.loaded_online = true;

        this.handleGameStateChange(v);
        // this.local_setState( {loaded_online: true} );
      }
      const reason = reason => {
        console.error(reason);
        alert(reason);
      }
      GameAPI.getGameState(this.gameId, handle, reason);
    }
  }

  componentWillUnmount() {
    GameAPI.off();
    UserAPI.off();
  }

  checkPlayers(stt) {
    stt.readonly = false;
    if (stt.playerX !== this.authUid && stt.playerO !== this.authUid) {
      if (!stt.playerX) {
        stt.playerX = this.authUid;
        this.setState({ playerX: stt.playerX });
      } else
        if (!stt.playerO) {
          stt.playerO = this.authUid;
          this.setState({ playerO: stt.playerO });
        } else {
          // set readonly, only if is an online game
          stt.readonly = this.online;
        }
    }

    // getPlayerInfo
    UserAPI.getUserState(stt.playerX, (user) => this.handleUserInfo('X', user));
    UserAPI.getUserState(stt.playerO, (user) => this.handleUserInfo('O', user));

    return stt;
  }

  handleUserInfo(kind, user) {
    const userInfo = {}
    // console.log(kind, user, this.state);
    Object.assign(userInfo, this.state['userInfo' + kind], user);

    this.setState({ ['userInfo' + kind]: userInfo }, null, true);
    if (this.authUid === userInfo.authUid) {
      (new UserState(userInfo)).addGame(this.gameId);
    }
  }

  handleGameStateChange(stt) {
    // console.log('handleGameStateChange', stt);
    this.local_setState(stt);
  }

  calculateWinner(squares, size) {
    let lines = this.winnerLines;
    if (!lines || lines.length !== (size * 2 + 2)) {
      lines = [];
      let col = [];
      let lin = [];
      // lines & columns
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          col = [...col, [(i * size) + j]];
          lin = [...lin, [(j * size) + i]];
        }
        lines = [...lines, col, lin];
        col = [];
        lin = [];
      }
      //diagonal left->right
      //diagonal right->left
      for (let i = 0; i < size; i++) {
        col = [...col, [(i * size) + i]];
        lin = [...lin, [(i * size) + (size - i) - 1]];
      }
      lines = [...lines, col, lin];
      this.winnerLines = lines;
    }

    var empate =
      (squares.length === size * size && size * size === this.stepNumber);
    if (empate)
      return "none";
    var winner = null;
    lines.some(line => {
      if (line.map(a => squares[a]).every((current, i, arr) => (current && arr[0] === current))) {
        winner = squares[line[0]];
        return true;
      } else {
        return false;
      }
    });
    return winner;
  }

  nextPlayerSymbol() {
    return ((this.state.stepNumber % 2) === 0 ? 'X' : 'O');
  }

  handleClick(i) {
    if (this.state.readonly) {
      return;
    }
    if (this.state.stepNumber < this.state.history.length - 1) {
      alert("Game was set read-only when you change step before.\n Go to the last move (#" + (this.state.history.length - 1) + ") to back to the game!");
      return;
    }
    if (this.online) {
      if (this.state['player' + this.nextPlayerSymbol()] !== this.authUid) {
        alert("Is not your turn. Please, wait for the other player!\n\nCould be difficult for him.");
        return;
      }
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = this.calculateWinner(squares, this.state.boardSize);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.nextPlayerSymbol();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      boardSize: this.state.boardSize || 3,
      winner,
    });
  }

  jumpTo(step) {
    this.local_setState({
      stepNumber: step,
    });
  }

  handleBoardSizeChange(event) {
    this.setState({ boardSize: parseInt(event.currentTarget.value, 10) })
  }

  gototheGame(nextGameId) {
    this.props.history.push('/play/' + this.state.nextGameId);
  }

  startNewGame() {
    const newstate = {
      name: this.state.name,
      boardSize: this.state.boardSize,
      player: this.whoami(),
    }
    GameAPI.newGame(newstate).then(
      Id =>
        this.setState(
          { nextGameId: Id },
          () => this.props.history.push('/play/' + Id)
        )
    );
  }

  calcNextStep(current) {
    if (this.online || this.readonly) return;
    // if (this.whoami() !== this.nextPlayerSymbol()) return;
    const max = (this.state.boardSize * this.state.boardSize);
    let opts = [];
    for (let i = 0; i <= max; i++) {
      if (!current.squares[i]) {
        opts.push(i);
      }
    }
    for (let seek = 0; seek < opts.length; seek++) {
      const rand = Math.floor(Math.random() * max) % opts.length;
      const opt = opts[rand];
      console.log(rand, opt, opts);
      if (!current.squares[opt]) {
        this.handleClick(opt);
        return;
      }
    }
    if (opts.length > 0)
      setTimeout(this.calcNextStep(current), 300);
  }

  whoami() {
    return (this.authUid === this.state.playerO) ? 'O' : (this.authUid === this.state.playerX) ? 'X' : 'observer';
  }

  handleClickAutoPlay({ kind, user }) {
    user.autoPlay = !user.autoPlay;
    this.setState({ ['userInfo' + kind]: user });
  }

  PlayerXO({ kind }) {
    let user = this.state['userInfo' + kind];
    if (!(user && kind)) {
      user = new UserState({ name: "Player " + kind });
    } else {
      user = new UserState(user);
    }

    const cssclass = 'player ' + (this.nextPlayerSymbol() === kind ? 'isyou' : 'isnotyou');
    return <div className={cssclass}>
      <div className="image"><img src={user.photoURL} alt="User" /></div>
      <div className="name">{user.name}</div>
      <div className="stats">{user.games_length()} games</div>
      {(!user.userId) ?
        <div className="stats">
          <input id={'AutoPlay' + kind} checked={user.autoPlay} onChange={this.handleClickAutoPlay.bind(this, { kind, user })} type="checkbox" />
          <label htmlFor={'AutoPlay' + kind}>AI Player</label>
        </div> : ""
      }
    </div>
  }

  PlayersConnected() {
    return (
      <div className="players">
        {this.PlayerXO({ kind: "X" })}
        {this.PlayerXO({ kind: "O" })}
      </div>
    );
  }

  render() {

    if (this.online && !this.state.loaded_online) {
      return (<section className="App-intro">
        <div>
          Loading the online game... <br />
          Please wait!
        </div>
      </section>);
    }

    if (this.state.boardSize < 3) return (<div>Board size is less than minimal 3.</div>);
    const gameHistory = this.state.history;
    const current = gameHistory[this.state.stepNumber];
    //const winner = this.calculateWinner(current.squares, this.state.boardSize);
    const winner = this.state.winner || this.calculateWinner(current.squares, this.state.boardSize);

    let status;

    let isyou = (this.whoami() === this.nextPlayerSymbol());

    if (winner) {
      status = 'Winner: ' + winner;
      isyou = !isyou;
    } else {
      if (this.state.stepNumber === this.state.boardSize * this.state.boardSize) {
        status = 'Tied';
      } else {
        status = 'Next player: ' + this.nextPlayerSymbol()
      }
    }
    let status2 = "";
    if (this.online) {
      if (isyou) {
        status2 = winner ? 'You WIN! Congrats!' : 'Your turn';
      } else {
        status2 = winner ? 'You loose, sorry...' : 'Other turn';
      }
    }

    const Status = () => (<div className={`${winner ? 'winner' : ''}${isyou ? 'isyou' : 'isnotyou'}`}>{status}<br />{status2}</div>);

    const moves = gameHistory.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game begin';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const BoardSizeSelect = () =>
      (this.online) ?
        (<div>This is an online game</div>) :
        (<div>
          <label htmlFor="boardsize">Select board size: </label>
          <select name="boardsize" onChange={this.handleBoardSizeChange.bind(this)} value={this.state.boardSize}>{
            Array(4).fill(3).map((v, i) => v + i * 2).map(number => (
              <option key={number.toString()} value={number}>{number}</option>
            ))}</select>
        </div>);

    const WhoAmIDiv = () =>
      (this.online) ?
        (<div className="isyou">You are the: {this.whoami()}</div>) : (<div />)

    const CreateOrFollow = () => {
      if (!this.online && this.state.stepNumber === this.state.boardSize * this.state.boardSize) {
        return (<button onClick={() => this.setState(this._INITIAL_state)}>Restart this game</button>);
      }
      if (!winner) return <div />;
      if (this.online) {
        if (this.state.nextGameId)
          return (<button onClick={() => this.gototheGame(this.nextGameId)}>Go to the new game created?</button>);
        else {

          return (<button onClick={() => this.startNewGame(this)}>Start a new like this</button>);
        }
      } else {
        return (<button onClick={() => this.setState(this._INITIAL_state)}>Restart this game</button>);
      }
    }

    // Calc next step when not online, but waiting a while
    if (!winner) {
      const u = this.state['userInfo' + this.nextPlayerSymbol()];
      if (u && u.autoPlay) {
        setTimeout(this.calcNextStep.bind(this, current), 550);
      }
    }

    return (
      <div className="game">
        <section className="App-intro">
          <div>
            To play online search for a match or then
            <br /> start one below and have fun.
          </div>
        </section>
        <section className="App-Game">

          <BoardSizeSelect />

          {this.PlayersConnected()}

          <div className="game-board">
            <Board boardSize={this.state.boardSize}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div><br />
          <WhoAmIDiv /><br />
          <div className="game-info">
            <Status />
            <CreateOrFollow />
            {this.options.showHistory ? (<div className="history">
              <h3>History of game moves:</h3>
              <div>
                {this.state.stepNumber >= 1 ? <button onClick={() => this.jumpTo(this.state.stepNumber - 1)}><i className="material-icons">navigate_before</i></button> : <div />}
                {this.state.stepNumber < gameHistory.length - 1 ? <button onClick={() => this.jumpTo(this.state.stepNumber + 1)}><i className="material-icons">navigate_next</i></button> : <div />}
              </div>
              <ol>{moves}</ol>
            </div>
            ) : ""}
          </div>
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

export default Game;