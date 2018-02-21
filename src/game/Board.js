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
  
  // renderColumns(rowidx, size) {
  //   let i=0;
  //   let ret=[];
  //   while (i < size){
  //     const sqid=i+(rowidx*size);
  //     ret = [...ret, this.renderSquare(sqid)];
  //     i++;
  //   }
  //   return (ret);
  // }
  
  // renderBoard(size) {
  //   let i=0;
  //   let ret=[];
  //   while (i < size){
  //     ret = [...ret, (<div className="board-row" key={'r'+i}>
  //          {this.renderColumns(i, size)}
  //        </div>)];
  //     i++;
  //   }
  //   return ret;
  // }
   
  renderB(arrayIDs, handleRender) {
    console.log(handleRender);
    return arrayIDs.map((value,index,roArr)=>{
      console.log(value,index,roArr);
      return handleRender(value, index, roArr);})
  }
   
  render() {
    const size=this.props.boardSize || 3;
    return (
      <div className="board">
        {this.renderB(Array(size).fill(0), ((value, rowidx, roArr)=> (<div className="board-row" key={rowidx}>
            {this.renderB(roArr, (value, colidx)=>this.renderSquare(colidx+(rowidx*size)))}</div>)))}
      </div>)
  }
}

export default Board;