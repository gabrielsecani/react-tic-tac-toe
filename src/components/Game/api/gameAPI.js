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
    try {
      this.boardSize = data.boardSize;
      this.createdAt = data.createdAt;
      this.gameId = data.gameId;
      this.name = data.name;
      this.playerO = data.playerO;
      this.playerX = data.playerX;
      
      if (!data.history && data.boardSize) {
        this.history = [{
          squares: Array(this.boardSize*this.boardSize).fill(false),
        }];
      } else {
        this.history = data.history;

        if(Array.isArray(this.history)){
          this.history.forEach(v=>{
            let sq=v.squares;
            if( ! Array.isArray(sq) ) {
              let s=Array(this.state.boardSize*this.state.boardSize).fill(null);
              for (const i in Array(this.state.boardSize*this.state.boardSize).fill(1).map((a,i)=>i)) {
                s[i] = sq[i];
              }
            }
          });
        }
      }

      this.createdAtString = this.createdAt?new Date(this.createdAt).toLocaleString():'';
      this.playersConnected = 
        (data.playerX?1:0) + 
        (data.playerO?1:0);
      
      this.stepNumber = Math.min(data.stepNumber, this.history.length-1);

    }catch(ex){
      this.error=ex;
      console.error('GameAPI::constructor()', ex);
    }
  }

  /**
   * Return an object for  storage 
   */
  toFBStorage() {
    const obj = {};
    if(this.boardSize!==undefined) obj.boardSize = this.boardSize||null;
    if(this.createdAt!==undefined) obj.createdAt = this.createdAt||null;
    if(this.gameId!==undefined) obj.gameId = this.gameId||null;
    if(this.name!==undefined) obj.name = this.name||null;
    if(this.playerO!==undefined) obj.playerO = this.playerO||null;
    if(this.playerX!==undefined) obj.playerX = this.playerX||null;
    if(this.stepNumber!==undefined) obj.stepNumber = this.stepNumber||0;
    if(this.history!==undefined) obj.history = (this.history)? this.history: [{
        squares: Array(this.boardSize).fill(false),
      }];
    return obj;
  }

}

class GameAPIClass {

  // constructor () {
  //   this.ref=this.getRef();
  // }

  off() {
    this.getRef().off();
  }

  getRef() {
    if(!this.ref)
      this.ref = firebaseDb.ref('/gameState');
    return this.ref;
  }
  getRefDelete() {
    if(!this.ref)
      this.ref = firebaseDb.ref('/gameState');
    return this.ref;
  }

  getNodeVal(childSnapshot) {
    return {
      key: childSnapshot.key,
      ...childSnapshot.val()
    }
  }

  getGameList(resolve, reject) {
    const getValue = (snapshot) => {
      var list = [];
      snapshot.forEach( (childSnapshot) => {
        // const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const val = new GameState(childData);
        if (val.error) {
          console.error(val.error);
          reject&&reject(val.error);
        } else {
          list.push(val);
        }
      });
      resolve && resolve(list);
    }//get value
    
    this.getRef().on('value', getValue );
  }

  deleteGame(game){
    this.getRefDelete().set({[game.gameId]: game},
      (a)=>{
        if(a)
        this.getRef().set({[game.gameId]: null});
      });
  }

  newGame(game) {
    return new Promise( (resolve, reject) => {
      // const gameId = firebaseDb.ref().child('gameList')
      const gameId = this.getRef().push().key;
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

      this.getRef().update(newListItem).then(
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
   * @param {string} gameId 
   * @param {string} type default is 'on'
   * @param {string} eventType default is 'value', could be "value", "child_added", "child_removed", "child_changed", or "child_moved".
   */
  getGameState(gameId, resolve, reject, type='on', eventType='value') {
      const thenExec = (s) => {
        const val = s.val();
        console.log('thenExec', val);
        if( !!!val ) {
          reject&&reject("Game not found");
          return;
        }
        let gamestate = new GameState(val);
        if (gamestate === null || gamestate.error) {
          reject&&reject('Game State error. ' + gamestate.error );
        } else {
          resolve&&resolve(gamestate);
        }
      };

      const child = this.getRef().child(gameId);
      if( type === 'on' ) {
        const onn=child.on('value',
          (a,b)=>console.log('callback',a,b)
        );
        console.log('onn', onn);
        child.on(eventType, thenExec, reject );
      } else {
        child.once(eventType, thenExec, reject );
      }
  }

  /**
   * 
   * @param {string} gameId 
   * @param {GameState} gameState 
   */
  setGameState(gameId, gameState) {
    return new Promise( (resolve, reject) => {
      const gs = new GameState(gameState).toFBStorage()
      const child = this.getRef().child(gameId);
      child.update(gs, resolve).then(resolve, reject );
    });
  }
}

const GameAPIs = new GameAPIClass();

export default GameAPIs;