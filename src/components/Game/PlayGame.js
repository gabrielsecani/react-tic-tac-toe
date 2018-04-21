import React from 'react';
// import ReactDOM from 'react-dom';
import GameAPIs from './api/gameAPI';
import '../Game/Game.css';
import Game from './Game';

class PlayGame extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.match.params.id,
      game: null,
    }
  }

  componentDidMount() {
    GameAPIs.getGameState(this.state.gameId, 'on')
    .then(state=>{
      console.log(state);
      this.setState(state);
    })
    .catch(reason=>{
      console.error(reason);
      alert(reason);
    });
  }

  componentWillUnmount() {
    GameAPIs.off();
  }

  handleStateChange(state){
    console.log('handleStateChange', state);
  }

  render() {
    return (<div>play game
        <div>
        {JSON.stringify(this.state)}
        </div>
        <Game state={this.state} onChangeState={this.handleStateChange.bind()} boardSize={this.state.boardSize} online="online"></Game>
      </div>
    );
  }

}

export default PlayGame;
