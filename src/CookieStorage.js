const COOKIE_NAME = require('../package.json').name;

/**
 * Cookie Storage
 */
class CookieStorage {

  /**
   * Constructor.
   */
  constructor(win) {
    this._win = win;
  }

  /**
   * Sets the value of the cookie.
   * @param {string} key The name of the cookie value.
   * @param {*} val The value of the storage object.
   */
  set (key, val) {
    this.storage = Object.assign(this.storage, {[key]: val});
  }

  /**
   * Gets the value of the cookie storage object.
   * @param {string} key The name of the key.
   * @returns {*}
   */
  get (key) {
    return this.storage[key];
  }

  /**
   * Deletes the value of the cookie storage object.
   * @param {string} key The name of the key.
   * @returns {*}
   */
  delete(key) {
    const newStorage = this.storage;
    delete newStorage[key];
    return this.storage = newStorage;
  }

  /**
   * Flushes the stored value.
   * @returns {boolean}
   */
  flush() {
    this.eraseCookie(COOKIE_NAME);
    return true;
  }

  /**
   * Gets the value of the storage cookie.
   * @returns {Object}
   */
  get storage() {
    const value = this.readCookie(COOKIE_NAME) || '{}';
    try {
      if (value) {
        return JSON.parse(decodeURIComponent(value));
      } else {
        return {};
      }
    } catch (e) {
      return {};
    }
  }

  /**
   * Sets the value of the storage cookie.
   * @param {object} value The new value of the storage cookie.
   */
  set storage(value) {
    value = encodeURIComponent(JSON.stringify(value));
    this.createCookie(COOKIE_NAME, value, 360);
  }

  /**
   * Reads the value of a cookie;
   * @param name
   * @returns {null}
   */
  readCookie(name) {
    const nameEQ = name + "=";
    const ca = this._win.document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  /**
   * Creates a cookie.
   * @param {string} name The name of the cookie.
   * @param {string|number} value The value of the cookie.
   * @param {number} days The number of days to save this cookie.
   */
  createCookie(name, value, days) {
    let expires;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 86400000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    this._win.document.cookie = name + "=" + value + expires + "; path=/";
  }

  /**
   * Erases a cookie.
   * @param {string} name The name of the cookie.
   */
  eraseCookie(name) {
    this.createCookie(name, "", -1);
  }

}

module.exports = CookieStorage;

