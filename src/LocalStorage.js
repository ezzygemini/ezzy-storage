const STORAGE_KEY = require('../package.json').name;
const PREFIX = `${STORAGE_KEY}:`;
const {version} = require('./package');

/**
 * Local Storage
 */
class LocalStorage {

  /**
   * Constructor.
   */
  constructor(win, prefix) {
    this._win = win;
    this._prefix = PREFIX + (prefix || '') + (prefix ? ':' : '');
    this._reg = new RegExp(`^${this._prefix}.*`);
  }

  /**
   * Gets the local storage.
   * @return {Storage}
   */
  get ls() {
    return this._win.localStorage;
  }

  /**
   * Gets the stored value.
   * @param {string} key
   * @returns {*}
   */
  get (key) {
    const item = this.ls.getItem(`${this._prefix}${key}`);
    if (!item) {
      return;
    }
    return JSON.parse(item).value;
  }

  /**
   * Gets the raw stored value.
   * @param {string} key
   * @returns {*}
   */
  getRaw(key) {
    const item = this.ls.getItem(`${this._prefix}${key}`);
    if (!item) {
      return;
    }
    return JSON.parse(item);
  }

  /**
   * Checks if the entry has a valid version.
   * @param {string} key The entry key.
   * @param {string} ver The optionsl version to check, otherwsie checks package
   * @return {boolean}
   */
  hasValidVersion(key, ver) {
    ver = ver || version;
    return (this.getRaw(key) || {}).version === ver;
  }

  /**
   * Stores a value.
   * @param {string} key The key of the stored data.
   * @param {*} value The value of the stored data.
   */
  set (key, value) {
    const date = Date.now();
    this.ls
      .setItem(`${this._prefix}${key}`, JSON.stringify({value, date, version}));
  }

  /**
   * Stores a value.
   * @param {string} key The key of the stored data.
   */
  delete(key) {
    this.ls.removeItem(`${this._prefix}${key}`);
  }

  /**
   * Flushes the storage.
   * @returns {boolean}
   */
  flush() {
    for (let key of Object.keys(this.ls)) {
      if (this._reg.test(key)) {
        this.ls.removeItem(key);
      }
    }
    return true;
  }

  /**
   * Flush keys with an older version.
   */
  flushOldVersions() {
    for (let key of Object.keys(this.ls)) {
      if (this._reg.test(key)) {
        try {
          if (version === JSON.parse(this.ls.getItem(key)).version) {
            continue;
          }
        } catch (e) {
          // we couldn't verify the version
        }
        this.ls.removeItem(key);
      }
    }
  }

  /**
   * Flush keys older than a specific date.
   * @param {Date} date The maximum date of when to keep items.
   */
  flushOlderThan(date) {
    const ts = date.getTime();
    for (let key of Object.keys(this.ls)) {
      if (this._reg.test(key)) {
        try {
          if (ts > JSON.parse(this.ls.getItem(key)).date) {
            continue;
          }
        } catch (e) {
          // we couldn't verify the date
        }
        this.ls.removeItem(key);
      }
    }
  }

}

module.exports = LocalStorage;
