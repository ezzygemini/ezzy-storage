const CACHE_KEY = require('../package.json').name;

/**
 * Memory Storage
 */
class MemoryStorage {

  /**
   * Constructor
   */
  constructor() {
    const Cache = require('ezzy-cache');
    this._cache = new Cache();
  }

  /**
   * Gets the value of the cached entry.
   * @param {string} key The key of the entry.
   * @returns {*}
   */
  get(key) {
    return this._cache.getLibrary(CACHE_KEY).get(key);
  }

  /**
   * Sets a value in the cache.
   * @param {string} key The name of the key.
   * @param {*} value The value of the cache entry.
   */
  set(key, value) {
    this._cache.getLibrary(CACHE_KEY).add(key, value);
  }

  /**
   * Deletes a value in the cache.
   * @param {string} key The name of the key.
   */
  delete(key) {
    this._cache.getLibrary(CACHE_KEY).remove(key);
  }

  /**
   * Flushes the cache library.
   */
  flush() {
    this._cache.getLibrary(CACHE_KEY).flush();
  }

}

module.exports = MemoryStorage;
