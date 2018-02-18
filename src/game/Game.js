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
      boardSize: 5,
      stepNumber: 0,
      winnerLines: null,
    };
  }

  calculateWinner(squares, size) {
    let lines = this.state.winnerLines;
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
      this.setState({winnerLines: lines});
    }
    let winner=null;
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
    if (this.calculateWinner(squares, this.state.boardSize) || squares[i]) {
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares, this.state.boardSize);

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
        <div className="game-board">
          <Board boardSize={this.state.boardSize}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


export default Game;