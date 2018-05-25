import React from 'react';
// import MyInput from '../MyInput';
// import ReactDOM from 'react-dom';
import GameAPI from './api/GameAPI';
import '../Game/Game.css';

class Tempo {
  constructor(timems){
    this.tempoTimeout=null;
    this.timeMs = timems;
  }

  run(timems, params=null) {
    const timeMs = timems || this.timeMs;
    if(this.tempoTimeout) {
      // console.log('Tempo:: timeout cancelled!', this.tempoTimeout);
      clearTimeout(this.tempoTimeout);
    }
    return new Promise(resolve => {
      this.tempoTimeout = setTimeout((params)=>{
        // console.log('Tempo:: hit!');
        if(resolve) resolve.apply(null, params);
        // if(this.tempoTimeout) clearTimeout(this.tempoTimeout);
      }, timeMs, params);
      // console.log('Tempo:: timeout has began!', this.tempoTimeout, timeMs);      
    });
  }
}

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      gameList: "Loading...",
    }

  }

  componentDidMount() {
    this.tempo = new Tempo(100);
    this.onSearch();
  }

  componentWillUnmount() {
    GameAPI.off();
  }

  doSearchGame() {
    const gameSearchName = this.searchRef.value;
    // console.log('doSearchGame');
    GameAPI.getGameList(
    list => {
      let filteredList = (gameSearchName === "") ? list:
        list.filter(g=>g.name.toUpperCase().indexOf(gameSearchName.toUpperCase())>=0);
      filteredList = filteredList
          .sort((a,b) => ( (a.playersConnected-b.playersConnected)*1000 + (a.history.length-b.history.length) ));
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
    const tms=(e&&e.target&& parseInt(e.target.attributes.delay.value,10))||100;
    this.tempo.run(tms).then(()=> {
      // console.log('executing doSearchGame', this.searchRef.value);
      this.doSearchGame();
    });
    this.searchRef.focus();
  }

  handleSelectGame(item) {
    //get the game selected on filling the player left
    this.props.history.push('/play/'+item.gameId);
  }
  
  render() {
    // const GameSearch = () => {
    //   return (<div>
    //     <input type="search" delay="10000" placeholder="Game Name to Search"
    //      ref={el=>this.searchRef=el}
    //      value={this.state.searchRef}
    //      onChange={this.onSearch.bind(this)} 
    //      />
    //     {/* <input value={this.state.gameSearchName} onChange={this.handleGameNameChange.bind(this)}/> */}
    //     <button value="Search" delay="10" onClick={this.onSearch.bind(this)}>Search</button>
    //   </div>);
    // }

    const GameList = () => (
    <div className="game-list">
      Games List
      <ol>
        {typeof this.state.gameList === 'string'?
          (<li><div className="name">{this.state.gameList}</div></li>):
          this.state.gameList.map( (list) =>
            (<li key={list.gameId} onClick={this.handleSelectGame.bind(this, list)}>
              <div className="item">
                <div className="name">{list.name}</div>
                <div className="row">
                  <div className="many">{list.playersConnected||0} player{list.playersConnected===2?"s":""}</div>
                  <div className="date">{list.createdAtString}</div>
                  <div className="state">
                    {(list.winner)?"Winner: "+list.winner:list.stepNumber+" move"+(list.stepNumber>1?"s":"")}
                  </div>
                </div>
              </div>
            </li>)
          )}
      </ol>
    </div>)
    
    return (
      <div className="game-search">
        <div className="telling">
          Here you are! Well, to join some one game you need 
          to be logged so just tell me a game name on the
          box below and click on Search button right over there!
        </div>

        <div>
          <input type="search" delay="1500" placeholder="Game Name to Search"
            ref={el=>this.searchRef=el} onChange={this.onSearch.bind(this)} />
          {/* <input value={this.state.gameSearchName} onChange={this.handleGameNameChange.bind(this)}/> */}
          <button value="Search" delay="10" onClick={this.onSearch.bind(this)}>Search</button>
        </div>

        <GameList/>

      </div>
    );
  }
}

export default Search;