import React from 'react';
import MyInput from '../MyInput';
// import ReactDOM from 'react-dom';
import GameAPIs from './api/gameAPI';

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      gameSearchName: '',
      gameList: [1,4,2],
    }
  }

  handleGameNameChange(event) {
    let state = { gameSearchName: event.target.value };
    this.doSearchGame(state);
  }
  
  doSearchGame(pstate){
    let state = Object.assign({}, pstate);
    let list = [];
    GameAPIs.getGameList(
      snapshot => {
        snapshot.forEach( (childSnapshot) => {
          const childKey = childSnapshot.key;
          // const childData = childSnapshot.val();
          if (!state.gameSearchName || childKey.toUpperCase().indexOf(state.gameSearchName.toUpperCase()) > -1) {
            list.push(GameAPIs.getNodeVal(childSnapshot));
          }
        });
        state.gameList = list;

        console.log(`searched for ${state.gameSearchName}.`, state, GameAPIs);
        // start a search for a game
        this.setState(state);
      });
  }

  onSearch(){
    // buscar no firebase por jogos disponiveis
    // search on firebase for available games
    this.doSearchGame(this.state);
  }

  render() {
    return (
      <div className="game-search">
      gameSearchName: '{this.state.gameSearchName}',
        <div className="telling">
          Here you are! Well, to join some one game you need to be logged <br/>
          and then just tell me some ones game name on box below or <br/>
          leave empty and click on Search button right over there!</div>
        <div>
          <MyInput placeholder="Game to Search" value={this.state.gameSearchName} onChange={this.handleGameNameChange.bind(this)}/>
          {/* <input value={this.state.gameSearchName} onChange={this.handleGameNameChange.bind(this)}/> */}
          <button value="Search" onClick={this.onSearch.bind(this)}>Search</button>
        </div>
        <div>
          <ol>
            {this.state.gameList
              .map((list)=>(<li key={list.key}>{list.name}({list.createdAt})</li>))}
              {/* .map((a,i)=>(<li key={i}>{i}{a}</li>))} */}
            {/* <GameSearch searchFor="*"/> */}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;