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
    if (this.userId!==undefined) obj.userId = this.userId||null;
    if (this.name!==undefined) obj.name = this.name||null;
    if (this.authtype!==undefined) obj.authtype = this.authtype||null;
    if (this.games!==undefined) obj.games = this.games||null;
    return obj;
  }

  addGame(gameId) {
    if (!Array.isArray(this.games)) this.games = [];
    if (!this.games.contains(gameId)) {
      this.games.push(gameId);
    }
  }
}

class UserAPIClass extends BaseAPIClass {

  constructor () {
    super();
    this.refURL = '/users/';
  }

  /**
   * Get the state of a gameId game.
   * The type param is once for get just once time or
   *  on to create an listener handle to catch changes
   *  from firebase 
   * @param {string} userId 
   * @param {string} type default is 'on'
   * @param {string} eventType default is 'value', could be "value", "child_added", "child_removed", "child_changed", or "child_moved".
   */
  getUserState(userId, resolve, reject, type='on', eventType='value') {
    const thenExec = (s) => {
      const val = s.val();
      // console.log('thenExec', val);
      if( !!!val ) {
        reject&&reject("User not found");
        return;
      }
      let userstate = new UserState(val);
      if (userstate === null || userstate.error) {
        reject&&reject('User State error. ' + userstate.error );
      } else {
        resolve&&resolve(userstate);
      }
    };

    const child = this.getRef().child(userId);
    if ( type === 'on' ) {
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
   * @param {UserState} userState 
   */
  setUserState(userState) {
    return new Promise( (resolve, reject) => {
      const gs = new UserState(userState).toFBStorage()
      const child = this.getRef().child(this.getUserId());
      child.update(gs, resolve).then(resolve, reject );
    });
  }
}

if (!window.UserAPI$) {
    window.UserAPI$ = new UserAPIClass();
}
const UserAPI = window.UserAPI$;

export default UserAPI;
