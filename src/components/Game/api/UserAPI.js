import BaseAPIClass from './BaseAPI';

/**
 * structures API base  for games 
 * features: create, update, remove and search a game
 * 
 * users: [
 *   userId: {
 *     userId: "Player nID hash",
 *     name: "Named ",
 *     games: ['1X0H', '2E9AG'],
 *   }
 * ]
 * 
 */
class UserState {
  constructor(data) {
    if (!data) return;
    try {
      this.userId = data.userId;
      this.name = data.name;
      this.games = data.games;
    } catch(ex) {
      this.error=ex;
      console.error('UserAPI::constructor()', ex);
    }
  }

  /**
   * Return an object for  storage 
   */
  toFBStorage() {
    const obj = {};
    if(this.userId!==undefined) obj.userId = this.userId||null;
    if(this.name!==undefined) obj.name = this.name||null;
    if(this.games!==undefined) obj.games = this.games||null;
    return obj;
  }
}

class UserAPIClass extends BaseAPIClass{

  constructor () {
    super();
    this.refURL = '/users/'+this.getUserId();
  }

  getUserState(resolve, reject) {
    const getValue = (snapshot) => {
      var list = [];
      snapshot.forEach( (childSnapshot) => {
        // const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const val = new UserState(childData);
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
          new UserState({
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
      // console.log('thenExec', val);
      if( !!!val ) {
        reject&&reject("Game not found");
        return;
      }
      let gamestate = new UserState(val);
      if (gamestate === null || gamestate.error) {
        reject&&reject('Game State error. ' + gamestate.error );
      } else {
        resolve&&resolve(gamestate);
      }
    };

    const child = this.getRef().child(gameId);
    if( type === 'on' ) {
      // const onn=child.on('value',
      //   (a,b)=>console.log('callback',a,b)
      // );
      child.on(eventType, thenExec, reject );
    } else {
      child.once(eventType, thenExec, reject );
    }
  }

  /**
   * 
   * @param {string} gameId 
   * @param {UserState} gameState 
   */
  setGameState(gameId, gameState) {
    return new Promise( (resolve, reject) => {
      const gs = new UserState(gameState).toFBStorage()
      const child = this.getRef().child(gameId);
      child.update(gs, resolve).then(resolve, reject );
    });
  }
}

if (!window.UserAPI$) {
    window.UserAPI$ = new UserAPIClass();
}

export default window.UserAPI$;