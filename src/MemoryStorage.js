const CACHE_KEY = require("../package.json").name;
const { version } = require("./package");

/**
 * Memory Storage
 */
class MemoryStorage {
  /**
   * Constructor
   */
  constructor() {
    const Cache = require("ezzy-cache");
    this._cache = new Cache();
  }

  /**
   * Gets the cache library.
   * @return {CacheLibrary}
   */
  get lib() {
    return this._cache.getLibrary(CACHE_KEY);
  }

  /**
   * Gets the value of the cached entry.
   * @param {string} key The key of the entry.
   * @returns {*}
   */
  get(key) {
    const item = this.lib.get(key);
    if (!item) {
      return;
    }
    return item.value;
  }

  /**
   * Gets the raw value of the cached entry.
   * @param {string} key The key of the entry.
   * @returns {*}
   */
  getRaw(key) {
    return this.lib.get(key);
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
   * Sets a value in the cache.
   * @param {string} key The name of the key.
   * @param {*} value The value of the cache entry.
   */
  set(key, value) {
    const date = Date.now();
    this.lib.add(key, { value, version, date });
  }

  /**
   * Deletes a value in the cache.
   * @param {string} key The name of the key.
   */
  delete(key) {
    this.lib.remove(key);
  }

  /**
   * Flushes the cache library.
   */
  flush() {
    this.lib.flush();
  }

  /**
   * Flush keys with an older version.
   */
  flushOldVersions() {
    for (let key of Object.keys(this.lib.keys)) {
      if (this.lib.get(key, {}).version === version) {
        continue;
      }
      this.lib.remove(key);
    }
  }

  /**
   * Flush keys older than a specific date.
   * @param {Date} date The maximum date of when to keep items.
   */
  flushOlderThan(date) {
    const ts = date.getTime();
    for (let key of Object.keys(this.lib.keys)) {
      if (ts < this.lib.get(key, {}).date) {
        continue;
      }
      this.lib.remove(key);
    }
  }
}

module.exports = MemoryStorage;
