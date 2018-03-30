import React from 'react';
// import ReactDOM from 'react-dom';

class Search extends React.Component {

  render() {
    return (
      <div className="game-search">
        <div className="telling">
          Here you are! Well, to join some one game you need to be logged (<div>ticok</div>)<br/>
          and then just tell me some ones game name on box below or <br/>
          leave empty and click on Search button right over there!</div>
        <div>
          <input placeholder="Game name" /><button value="Search"/>
        </div>
        <div>
          <ol>
            {Array(3).fill(1)
              .map((a,i)=>(<il key={i}>{i}</il>))}
            {/* <GameSearch searchFor="*"/> */}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;