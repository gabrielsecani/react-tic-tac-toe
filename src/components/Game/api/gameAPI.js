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
 *     },
 *     gameId: {gameId: 'someID', name: 'game name', createdAt: '2018-01-30T14:45',},
 *   }
 * }
 * 
 * games: {
 *   1X0H: {
 *     playerX: $userId,
 *     playerO: $userId,
 *     gameState: {
 *       history: [{
 *         squares: Array(this.props.boardSize).fill(null),
 *       }],
 *     },
 *   },
 * }
 * 
 */

class GameListItem {
  constructor(key, data){
    this.key = key || data.gameId;
    this.name = data.name;
    this.gameId = data.gameId;
    this.createdAt = data.createdAt;
    this.createdAtString = new Date(this.createdAt).toLocaleString();
    this.playersConnected = data.playersConnected;
  }
}

class GameAPIClass {

  getNodeVal(childSnapshot){
    return {
      key: childSnapshot.key,
      ...childSnapshot.val()
    }
  }

  getOnce(ref, eventType) {
    return ref.once(eventType || 'value')
  }

  getOn(ref, eventType) {
    return ref.on(eventType || 'value')
  }

  getGameListRef() {
    return firebaseDb.ref('gameList');
  }

  getGameList() {
    return new Promise((resolve, reject)=>{
      return this.getOnce(this.getGameListRef().orderByChild('createdAt').limitToLast(5)).then(
        snapshot => {
          var list = [];
          snapshot.forEach( (childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            list.push(new GameListItem(childKey, childData));
            list;
          });
          resolve && resolve(list);
      })//getOnce
    });//Promise
  }

  newGame(game) {
    return new Promise( (resolve, reject) => {
      // const gameId = firebaseDb.ref().child('gameList')
      const ref=this.getGameListRef();
      const gameId = ref.push().key;
      // const gameId = hash.sha1(hash.sha1(game));
      const newListItem = {
        [gameId]: {
          gameId,
          name: game.name,
          ['player'+game.player]: firebaseDb.app.auth().currentUser.uid,
          playersConnected: 1,
          createdAt: new Date().getTime(),
        }
      };
      console.error(newListItem);
      ref.update(newListItem)
      .then( val => {
        console.log(val);
        resolve && resolve(val) 
      });
    });
  }

}

const GameAPIs = new GameAPIClass();

export default GameAPIs;