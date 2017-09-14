const STORAGE_KEY = require('../package.json').name;

/**
 * Local Storage
 */
class LocalStorage {

  /**
   * Constructor.
   */
  constructor(win){
    this._win = win;
  }

  /**
   * Gets the stored value.
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this.storage[key];
  }

  /**
   * Stores a value.
   * @param {string} key The key of the stored data.
   * @param {*} val The value of the stored data.
   */
  set(key, val) {
    this.storage = Object.assign(this.storage, {[key]: val});
  }

  /**
   * Flushes the storage.
   * @returns {boolean}
   */
  flush() {
    this._win.localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  /**
   * Gets the local storage value.
   * @returns {Object}
   */
  get storage() {
    const raw = this._win.localStorage.getItem(STORAGE_KEY) || '{}';
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  /**
   * Sets the value of the storage.
   * @param {Object} value The value of the storage.
   */
  set storage(value) {
    this._win.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

}

module.exports = LocalStorage;
