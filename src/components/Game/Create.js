import React from 'react';
import GameAPI from './api/GameAPI';
import '../Game/Game.css';

class Create extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      boardSize: 3,
      player: 'X',
    }
  }

  handleNameChange(event) {
    // get the game selected on filling the player left
    this.setState({ name: event.target.value });
  }

  handleSelectPlayer(player) {
    this.setState({ player });
  }

  handleBoardSizeChange(event) {
    // console.log(this, event);
    this.setState({ boardSize: parseInt(event.currentTarget.value, 10) })
  }

  createGame(event) {
    GameAPI.newGame(this.state).then(Id => this.props.history.push('/play/' + Id));
    event.preventDefault();
  }

  render() {
    return (
      <div className="game-create">
        <div className="telling">
          Here you are! Well, to join some one game you need
          to be logged so just tell me a game name on the
          box below and click on Search button right over there!
        </div>
        <form onSubmit={this.createGame.bind(this)}>

          <div>
            <label htmlFor="name">Game Name </label>
            <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange.bind(this)} />
          </div>

          <div>
            <label htmlFor="boardsize">Select board size: </label>
            <select name="boardsize" onChange={this.handleBoardSizeChange.bind(this)}>{
              Array(4).fill(3).map((v, i) => v + i * 2).map(number => (
                <option key={number.toString()} value={number}>{number}</option>
              ))}</select>
          </div>

          <div>
            <input type="radio" name="player" value="X" onChange={this.handleSelectPlayer.bind(this, 'X')} checked={this.state.player === "X"} />
            <label onClick={this.handleSelectPlayer.bind(this, 'X')} >X</label>
            <input type="radio" name="player" value="O" onChange={this.handleSelectPlayer.bind(this, 'O')} checked={this.state.player === "O"} />
            <label onClick={this.handleSelectPlayer.bind(this, 'O')} >O</label>
          </div>
          <button>Create a game</button>
        </form>
      </div>
    );
  }
}

export default Create;