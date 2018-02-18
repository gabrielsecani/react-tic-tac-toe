import React from 'react';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={'square'.concat(i)}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }
  renderCols(rowidx, size) {
    let i=0;
    let ret=[];
    while (i < size){
      const sqid=i+(rowidx*size);
      ret = [...ret, this.renderSquare(sqid)];
      i++;
    }
    return (ret);
  }
  
  renderRows(size) {
    let i=0;
    let ret=[];
    while (i < size){     
      ret = [...ret, (<div className="board-row" key={'r'+i}>
           {this.renderCols(i, size)}
         </div>)];
      i++;
    }
    return ret;
  }
   
  render() {
    const size=this.props.boardSize || 3;
    return (
      <div>
        {this.renderRows(size)}
      </div>
    );
  }
}

export default Board;