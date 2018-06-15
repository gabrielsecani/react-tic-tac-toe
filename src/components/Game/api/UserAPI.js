import BaseAPIClass from './BaseAPI';

const DEFAULT_USER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKcSURBVGhD7ZY9iNRAGIbX3+JEW0G0sLtDQRutRVbU22QP0RVE2WTluELsLE02rSTLieAhiNedFtd4xV2y/oDFITayhYKCeGDhXynKiacy4zvnV1h8HEnczUScB142JDPv907mS7IVg8FgyI3oju0SXfuiSOwZEduPVqWO1Tlco2HlRdyv7xCJNQ39lIktOWFRP3D9lnhob6dp5UJ0awdFbL3jwnNSY6EDNL0coG32yNj6xAVeU5gj5kdHyEYvcraxGe3ykg2aQrgJL+TTiU1kpw/1AHMBswgtdoHs9IHdeM6FyyI8/M/ITg/inr2bC5ZHWl/LMqlXuVD5VK+SbfHgQT3Dh8ou5UW2xSMWrONcqDwSSe0o2RaP+gZwoXKpaw2TrR7QEm/YYBkEjyWy0we+AQEXLovg0SY7fYj42DYE+cgFTCPMfS/m6lvJTi9iwT6MQN+5oGsJH8IVmdQOkU05QJ+fRrCvXGBOGL8s4topml4u5PzofuzMYy74n8IiFvG3fx9NKy+rrZbYU9ihHn4//BaOY/u6ukbDDIb/inOXoi2u3znieKEP3XH98InjR6/w+1aJjtW522pM63JYnQiCIZqulyAINjp+eNLxojnXi1ZcP5JZhLnfsLi7TT880WjMbiDb4sAC1rteZxx3dokLmFOvW+2opbypzGA5H0R7cRd7TJA+KeypGlRuMGAHXLTRMh+gf1I1VC0q20/kOtcLb3BFByksZkrVphB/h+pZvGmmuUKFyItu9mUx2IlrbIEChbfbJMXJR9MLm5yxDjntzlmKlY3x4MpO9OgXzlSH0N6fVSaKlx601AxnqFXIRPHSg75cZM00SmWieOkxCxmgzEI4M53KtRB8Ua/ilfegTFKZKJ7BYDD801QqvwCn74JqWSp+EQAAAABJRU5ErkJggg==';
/**
 * structures API base  for games 
 * features: create, update, remove and search a game
 * 
 * users: [
 *   userId: {
 *     userId: "Player nID hash",
 *     name: "Named ",
 *     photoURL: "{url}",
 *     games: ['1X0H', '2E9AG'],
 *   }
 * ]
 * 
 */
class UserState {
  constructor(data) {
    if (!data) return false;
    try {
      this.userId = data.userId;
      this.name = data.name;
      this.photoURL = data.photoURL || DEFAULT_USER_IMAGE;
      this.games = data.games||[];
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
    if (this.name!==undefined) obj.name = this.name||'';
    if (this.authtype!==undefined) obj.authtype = this.authtype||null;
    if (this.games!==undefined) obj.games = this.games||[];
    if (this.photoURL!==undefined) obj.photoURL = this.photoURL;
    return obj;
  }

  games_length() {
    return (this.games && this.games.length) || 0;
  }

  addGame(gameId) {
    if (!Array.isArray(this.games)) this.games = [];
    const oldlen = this.games_length();
    if (!this.games.find(a=>a&&a===gameId)) {
      this.games.push(gameId);
    }
    if (oldlen !== this.games_length()) {
      UserAPI.setUserState(this);
    }
    return this;
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
  getUserState(userId, resolve, reject=null, type='on', eventType='value') {
    if (!userId) {
      return resolve(new UserState({name: ''}));
    }
    if (!resolve) resolve = (m)=>console.info('UserAPI::getUserState().resolve', m);
    if (!reject) reject = (m)=>console.info('UserAPI::getUserState().reject', m);
    
    const thenExec = (s) => {
      const val = s.val();
      // console.log('thenExec', val);
      if ( !!!val ) {
        reject({code:404, msg:"User not found"});
        return;
      }
      let userstate = new UserState(val);
      if (userstate === null || userstate.error) {
        reject({code:404, msg: 'User State error. ' + userstate.error });
      } else {
        resolve&&resolve(userstate);
      }
    };

    const child = this.getRef().child(userId);
    if ( type === 'on' ) {
      // const onn=child.on('value',
      //   (a,b)=>console.log('callback',a,b)
      // );
      child.on(eventType, (s)=>thenExec(s), reject );
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
export { UserState };
