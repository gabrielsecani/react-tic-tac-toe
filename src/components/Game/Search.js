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

  run(timems, params=null) {
    const timeMs = timems || this.timeMs;
    if(this.tempoTimeout) {
      console.log('Tempo:: timeout cancelled!', this.tempoTimeout);
      clearTimeout(this.tempoTimeout);
    }
    return new Promise(resolve => {
      this.tempoTimeout = setTimeout((params)=>{
        console.log('Tempo:: hit!');
        if(resolve) resolve.apply(null, params);
        // if(this.tempoTimeout) clearTimeout(this.tempoTimeout);
      }, timeMs, params);
      console.log('Tempo:: timeout has began!', this.tempoTimeout, timeMs);      
    });
  }
}

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      gameList: [],
    }

  }

  componentDidMount() {
    this.tempo = new Tempo(100);
    this.onSearch();
  }

  componentWillUnmount() {
    GameAPIs.off();
  }

  doSearchGame(gameSearchName) {
    console.log('doSearchGame');
    GameAPIs.getGameList(
    list => {
      const filteredList = (gameSearchName === "") ? list:
        list.filter(g=>g.name.toUpperCase().indexOf(gameSearchName.toUpperCase())>=0);
      this.setState({
        gameList: filteredList,
      });
    }, 
    rejct => {
      console.log(rejct);
    });
  }

  onSearch(e) {
    // buscar no firebase por jogos disponiveis
    // search on firebase for available games
    console.log('onSearch',this.searchRef.value);
    const tms=(e&&e.target&& parseInt(e.target.delay,10))||1000;
    this.tempo.run(tms).then(()=> {
      console.log('executing doSearchGame', this.searchRef.value);
      this.doSearchGame(this.searchRef.value);
    }
    );
  }

  handleSelectGame(item) {
    //get the game selected on filling the player left
    this.props.history.push('/play/'+item.gameId);
  }
  
  render() {
    const GameSearch = (props) => {
      return (<div>
        <input type="search" delay="1000" placeholder="Game Name to Search" ref={el=>this.searchRef=el} onChange={this.onSearch.bind(this)} />
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