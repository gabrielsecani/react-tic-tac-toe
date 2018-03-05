import React from 'react';
// import ReactDOM from 'react-dom';
import Board from './Board';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(this.props.boardSize).fill(null),
      }],
      stepNumber: 0,
      winnerLines: null,
    };
    this.options = {
      showHistory: true,
    };
    Object.assign(this.options, this.props, this.props.options);
  }

  calculateWinner(squares, size) {
    let lines = this.winnerLines;
    if (!lines || lines.length !== (size*2+2)){
      lines = [];
      let col = [];
      let lin = [];
      // lines & columns
      for (let i=0; i < size; i++){
        for (let j=0; j < size; j++){
          col = [...col, [(i*size)+j]];
          lin = [...lin, [(j*size)+i]];
        }
        lines = [...lines, col, lin];
        col = [];
        lin = [];
      }
      //diagonal left->right
      //diagonal right->left
      for (let i=0; i < size; i++){
          col = [...col, [(i*size)+i]];
          lin = [...lin, [(i*size)+(size-i)-1]];
      }
      lines = [...lines, col, lin];
      this.winnerLines = lines;
      // setTimeout(()=>{
      //   console.log('setstate');
      //   this.setState({
      //     // history: [{
      //     //   squares: Array(this.props.boardSize).fill(null),
      //     // }],
      //     // stepNumber: 0,
      //     winnerLines: lines,
      //   });
      // }, 10000);
    }
    
    var empate=
      (squares.length === size*size && size*size === this.stepNumber);
    if(empate)
      return "none";
    var winner=null;
    lines.some(line=>{
      if(line.map(a=>squares[a]).every((current,i,arr)=>(current && arr[0]===current))){
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
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares, this.props.boardSize) || squares[i]) {
      return;
    }
    squares[i] = this.nextPlayerSymbol();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
  }

  handleBoardSizeChange(event) {
    // console.log(this, event);
    this.setState({boardSize: parseInt(event.currentTarget.value, 10)})
  }

  render() {
    if(this.props.boardSize<3) return (<br/>);
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares, this.props.boardSize);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.nextPlayerSymbol());
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <section className="App-intro">
          <div>
            To play online search for a match or then
            <br/> start one below and have fun.
          </div>
        </section>
        <section className="App-Game">
          <div>
            <label htmlFor="boardsize">Select board size: </label>
            <select name="boardsize" onChange={this.handleBoardSizeChange.bind(this)}>{
              Array(4).fill(3).map((v,i)=>v+i*2).map(number=>(
                <option key={number.toString()} value={number}>{number}</option>
            ))}</select>
          </div>

          <div className="game-board">
            <Board boardSize={this.props.boardSize}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              />
          </div>
          <div className="game-info">
            <div>{status}</div>
            {this.options.showHistory?(<ol>{moves}</ol>):""}
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