import { firebaseDb } from '../../Fire';

class BaseAPIClass {

  constructor() {
    this.firebaseDb = firebaseDb;
    this.refURL = '/';
  }

  /**
   * return a promise that resolve (.then()) in a time
   * @param {Integer} time in miliseconds
   */
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * get auth user id
  */
  getUserId() {
    return this.getAuthUser().uid;
  }

  /**
   * get whole Auth User 
   */
  getAuthUser() {
    return firebaseDb.app.auth().currentUser;
  }

  /**
   * Get a value from firebase node
   * @param {Snapshot} childSnapshot 
   */
  getNodeVal(childSnapshot) {
    return {
      key: childSnapshot.key,
      ...childSnapshot.val()
    }
  }

  /**
   * Hangoff all observers/listeners
   */
  off() {
    this.getRef().off();
  }

  /** 
   * Reference of firebase path
  */
  getRef() {
    if (!this.ref)
      this.ref = firebaseDb.ref(this.refURL || '/');
    return this.ref;
  }

}

export default BaseAPIClass;