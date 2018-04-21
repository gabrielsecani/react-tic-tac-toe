import React from 'react';
// import MyInput from '../MyInput';
// import ReactDOM from 'react-dom';
import GameAPIs from './api/gameAPI';
import '../Game/Game.css';

class Tempo {
  constructor(timems){
    this.tempoTimeout=null;
    this.timeMs = timems;
  }

  run(timems) {
    const timeMs = timems || this.timeMs;
    if(this.tempoTimeout) clearTimeout(this.tempoTimeout);
    return new Promise(resolve => {
      this.tempoTimeout = setTimeout(()=>{
        if(resolve) resolve.apply();
        if(this.tempoTimeout) clearTimeout(this.tempoTimeout);
      }, timeMs);
    });
  }
}

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      gameList: [],
    }
    this.tempo = new Tempo(1000);
    this.tempo.run().then(a=>console.log(a))

    setTimeout(()=>this.onSearch(),250);
    // this.handleGameNameChange = this.handleGameNameChange.bind(this);
  }

  componentWillUnmount() {
    GameAPIs.off();
  }
  
  doSearchGame(gameSearchName) {
    this.tempo.run().then(()=> {
      GameAPIs.getGameList().then(
      list => {
        const filteredList = (gameSearchName === "") ? list:
          list.filter(g=>g.name.indexOf(gameSearchName)>=0);
        this.setState({
          gameList: filteredList,
        });
      }, 
      rejct => {
        console.log(rejct);
      });
    });
  }

  onSearch(){
    // buscar no firebase por jogos disponiveis
    // search on firebase for available games
    this.doSearchGame(this.searchRef.value);
  }

  handleSelectGame(item){
    //get the game selected on filling the player left
    this.props.history.push('/play/'+item.gameId);
  }
  
  render() {
    const GameSearch = (props) => {
      return (<div>
        <input type="search" placeholder="Game Name to Search" ref={el=>this.searchRef=el} onChange={this.onSearch.bind(this)} />
        {/* <input value={this.state.gameSearchName} onChange={this.handleGameNameChange.bind(this)}/> */}
        <button value="Search" onClick={this.onSearch.bind(this)}>Search</button>
      </div>);
    }
    
    return (
      <div className="game-search">
        <div className="telling">
          Here you are! Well, to join some one game you need 
          to be logged so just tell me a game name on the
          box below and click on Search button right over there!
        </div>
        <GameSearch/>
        <div className="game-list">
          Games List
          <ol>
            {this.state.gameList.map( (list) =>
            (<li key={list.gameId} onClick={this.handleSelectGame.bind(this, list)}>
              <div className="name">{list.name}</div>
              <div className="many">{list.playersConnected||0} players</div>
              <div className="date">{list.createdAtString}</div>
            </li>))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;