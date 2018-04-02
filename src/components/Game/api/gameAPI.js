import { firebaseDb } from '../../Fire';

/**
 * structures API base  for games 
 * features: create, update, remove and search a game
 * 
 * users: {
 *   userId: "",
 *   name: "",
 * }
 * 
 * gameList: {
 *   {
 *     1X0H: {name: 'Joanis Game', createdAt: '2018-01-30T14:45'},
 *     gameId: {name: 'game name', createdAt: '2018-01-30T14:45'},
 *   }
 * }
 * 
 * games: {
 *   1X0H: {
 *     userX: ref(users.userID),
 *     userO: ref(users.userID),
 *     gameState: {
 *       history: [{
 *         squares: Array(this.props.boardSize).fill(null),
 *       }],
 *     },
 *   },
 * }
 * 
 */
class GameAPIClass {

  getNodeVal(childSnapshot){
    return {
      key: childSnapshot.key,
      ...childSnapshot.val()
    }
  }

  getGameList(onsuccess) {
    const ref = firebaseDb.ref('gameList').orderByChild('createdAt').limitToLast(5);
    return ref.once('value', onsuccess);
  }
}

const GameAPIs = new GameAPIClass();

export default GameAPIs;