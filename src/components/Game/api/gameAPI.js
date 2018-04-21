import { firebaseDb } from '../../Fire';

//import hash from 'object-hash';

/**
 * structures API base  for games 
 * features: create, update, remove and search a game
 * 
 * users: {
 *   userId: "Player nID hash",
 *   name: "Named ",
 *   gameId: '1X0H',
 * }
 * 
 * gameList: {
 *   {
 *     1X0H: {
 *       gameId: '1X0H',
 *       name: 'Joanis Game', 
 *       createdAt: '1523975133577',
 *       playersConnected: 1,
 *       boardSize: 3,
 *       gameState: {
 *         history: [{
 *           squares: Array(this.props.boardSize).fill(null),
 *         }],
 *       },
 *     },
 *   },
 * }
 * 
 */
class GameState {
  constructor(data){
    if(!data) return;
    this.boardSize = data.boardSize || 3;
    this.createdAt = data.createdAt;
    this.gameId = data.gameId;
    this.name = data.name;
    this.playerO = data.playerO;
    this.playerX = data.playerX;
    this.stepNumber = data.stepNumber;
    this.history = data.history;

    this.createdAtString = new Date(this.createdAt).toLocaleString();
    this.playersConnected = 
      (data.playerX?1:0) + 
      (data.playerO?1:0);
  }

  /**
   * Return an object for  storage 
   */
  toFBStorage(){
    return {
      boardSize: this.boardSize,
      createdAt: this.createdAt,
      gameId: this.gameId, 
      name: this.name,
      playerO: this.playerO||null,
      playerX: this.playerX||null,
      stepNumber: this.stepNumber||0,
      history: (this.history)? this.history: [{
        squares: Array(this.boardSize).fill(null),
      }],
    };
  }
}

class GameAPIClass {

  constructor () {
    this.ref=this.getGameStateRef();
  }

  off() {
    this.ref.off();
  }

  getGameStateRef() {
    return firebaseDb.ref('gameState');
  }

  getNodeVal(childSnapshot){
    return {
      key: childSnapshot.key,
      ...childSnapshot.val()
    }
  }

  getGameList() {
    return new Promise((resolve, reject)=>{
      return this.ref
        .orderByChild('createdAt')
        .limitToLast(5)
        .on('value', 
        snapshot => {
          var list = [];
          snapshot.forEach( (childSnapshot) => {
            // const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            list.push(new GameState(childData));
          });
          resolve && resolve(list);
      })//get value
    });//Promise
  }

  newGame(game) {
    return new Promise( (resolve, reject) => {
      // const gameId = firebaseDb.ref().child('gameList')
      const gameId = this.ref.push().key;
      // const gameId = hash.sha1(hash.sha1(game));
      const newListItem = {
        [gameId]: 
          new GameState({
            gameId,
            boardSize: game.boardSize,
            createdAt: new Date().getTime(),
            ['player'+game.player]: this.getUserId(),
            name: game.name,
          }).toFBStorage()
      };

      this.ref.update(newListItem).then(
        () => resolve && resolve(gameId), 
        (r) => reject && reject(r)
      );
    });
  }

  getUserId() {
    return firebaseDb.app.auth().currentUser.uid;
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * Get the state of a gameId game.
   * The type param is once for get just once time or
   *  on to create an listener handle to catch changes
   *  from firebase 
   * @param {*} gameId 
   * @param {*} type default is 'once'
   */
  getGameState(gameId, type) {
    return new Promise( (resolve, reject) => {
      const thenExec = (s,v) => {
        const val = s.val();
        if( !!!val ) {
          reject("Game not found");
          return;
        }
        let gamestate = new GameState(val);
        if (gamestate === null) {
          reject('Game not found');
        } else {
          resolve(gamestate);
        }
      };

      const child = this.ref.child(gameId);
      if( type === "on" ) {
        child.on('value', thenExec, reject );
        // child.on('child_added', thenExec, reject );
        // child.on('child_changed', thenExec, reject );
      } else {
        child.once('value', thenExec, reject );
      }
    });
  }
}

const GameAPIs = new GameAPIClass();

export default GameAPIs;