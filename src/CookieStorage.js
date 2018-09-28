const COOKIE_NAME = require("../package.json").name;
const { version } = require("./package");

/**
 * Cookie Storage
 */
class CookieStorage {
  /**
   * Constructor.
   */
  constructor(win, prefix) {
    this._win = win;
    this._cookie = COOKIE_NAME + (prefix || "");
  }

  /**
   * Sets the value of the cookie.
   * @param {string} key The name of the cookie value.
   * @param {*} value The value of the storage object.
   */
  set(key, value) {
    const date = Date.now();
    this.storage = Object.assign(this.storage, {
      [key]: {
        val: value,
        d: date,
        v: version
      }
    });
  }

  /**
   * Gets the value of the cookie storage object.
   * @param {string} key The name of the key.
   * @returns {*}
   */
  get(key) {
    const item = this.storage[key];
    if (!item) {
      return;
    }
    return item.val;
  }

  /**
   * Gets the raw value of the cookie storage object.
   * @return {*}
   */
  getRaw() {
    return this.storage[key];
  }

  /**
   * Checks if the entry has a valid version.
   * @param {string} key The entry key.
   * @param {string} ver The optionsl version to check, otherwsie checks package
   * @return {boolean}
   */
  hasValidVersion(key, ver) {
    ver = ver || version;
    return (this.getRaw(key) || {}).v === ver;
  }

  /**
   * Deletes the value of the cookie storage object.
   * @param {string} key The name of the key.
   * @returns {*}
   */
  delete(key) {
    const newStorage = this.storage;
    delete newStorage[key];
    return (this.storage = newStorage);
  }

  /**
   * Flushes the stored value.
   * @returns {boolean}
   */
  flush() {
    this.eraseCookie(this._cookie);
    return true;
  }

  /**
   * Flush keys with an older version.
   */
  flushOldVersions() {
    const cookieVal = this.storage;
    const newVal = {};
    for (let key of Object.keys(cookieVal)) {
      try {
        if (version === cookieVal(key).version) {
          newVal[key] = cookieVal[key];
        }
      } catch (e) {
        // we couldn't verify the date
      }
    }
    this.storage = cookieVal;
  }

  /**
   * Flush keys older than a specific date.
   * @param {Date} date The maximum date of when to keep items.
   */
  flushOlderThan(date) {
    const cookieVal = this.storage;
    const newVal = {};
    const ts = date.getTime();
    for (let key of Object.keys(cookieVal)) {
      try {
        if (ts > cookieVal(key).date) {
          newVal[key] = cookieVal[key];
        }
      } catch (e) {
        // we couldn't verify the date
      }
    }
    this.storage = cookieVal;
  }

  /**
   * Gets the value of the storage cookie.
   * @returns {Object}
   */
  get storage() {
    const value = this.readCookie(this._cookie) || "{}";
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
    this.createCookie(this._cookie, value, 360);
  }

  /**
   * Reads the value of a cookie;
   * @param name
   * @returns {null}
   */
  readCookie(name) {
    const nameEQ = name + "=";
    const ca = this._win.document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
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
      date.setTime(date.getTime() + days * 86400000);
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
