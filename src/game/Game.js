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
    };
  }

  nextPlayerSymbol() {
    return ((this.state.stepNumber % 2) === 0 ? 'X' : 'O');
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();//copy array to do not mutate 
    if (calculateWinner(squares, this.state.boardSize) || squares[i]) {
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
    const winner = calculateWinner(current.squares, this.state.boardSize);

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

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }

function calculateWinner(squares, size) {
  let lines = [];
  let col = [];
  // linhas
  for (let i=0; i < size; i++){
    for (let j=0; j < size; j++){
      col = [...col, [(i*size)+j]];
    }
    lines = [...lines, col];
      col = [];    
  }
  //colunas
  for (let i=0; i < size; i++){
    for (let j=0; j < size; j++){
      col = [...col, [(j*size)+i]];
    }
    lines = [...lines, col];
      col = [];    
  }
  //diagonal left->right
  for (let i=0; i < size; i++){
      col = [...col, [(i*size)+i]];
  }
  lines = [...lines, col];
  col=[]
  //diagonal right->left
  for (let i=0; i < size; i++){
      col = [...col, [(i*size)+(size-i)-1]];
  }
  console.log('cols',...col)
  lines = [...lines, col];
  col=[]
  // console.log('lines',lines);
  for (let i = 0; i < lines.length; i++) {
    // console.log(i);
    const t=squares[lines[i][0]];// first value for test
    // console.log("lines["+i+"]: ", lines[i], t);
    const ret = ( lines[i].reduce((v,a)=>{
      console.log('v:',v, 'a:',a, 't:',t, 's',squares[a]); 
      return (squares[a] && (v && (t===squares[a]))
    )}, true) );
    console.log('result:',ret);
    if(ret){
      console.log('winner found: ', t, i, lines[i]);
      console.log('squares',squares);
      return t;
    }
  }
  return null;
}

export default Game;