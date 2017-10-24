/**
 * Storage Wrapper
 */
class Storage {

  /**
   * Constructor.
   * @param {*} win The window object.
   */
  constructor(win) {

    let type;
    if (win) {
      if (win.localStorage) {
        type = 'localStorage';
      } else {
        type = 'cookie';
      }
    } else {
      type = 'memory';
    }

    let InternalStorage;
    switch (type) {
      case 'local':
      case 'localStorage':
        InternalStorage = require('./LocalStorage');
        break;
      case 'cookie':
        InternalStorage = require('./CookieStorage');
        break;
      default:
        InternalStorage = require('./MemoryStorage');
    }

    /**
     * @type {MemoryStorage|LocalStorage|CookieStorage}
     */
    this._storage = new InternalStorage(win);
  }

  /**
   * Gets a storage by its key.
   * @param {*} args The arguments passed to the storage.
   * @returns {*}
   */
  get(...args) {
    return this._storage.get(...args);
  }

  /**
   * Sets a storage by its key.
   * @param {*} args The arguments passed to the storage.
   * @returns {*}
   */
  set(...args) {
    return this._storage.set(...args);
  }

  /**
   * Deletes a storage by its key.
   * @param {*} args The arguments passed to the storage.
   * @returns {*}
   */
  delete(...args) {
    return this._storage.delete(...args);
  }

  /**
   * Flushes the storage.
   * @returns {*}
   */
  flush() {
    return this._storage.flush();
  }

}

module.exports = Storage;
