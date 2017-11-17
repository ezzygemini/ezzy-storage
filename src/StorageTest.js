const CACHE_KEY = require('../package.json').name;
const Storage = require('./Storage');
const MemoryStorage = require('./MemoryStorage');
const LocalStorage = require('./LocalStorage');
const CookieStorage = require('./CookieStorage');
let storage;

describe('Storage', () => {

  it('should fallback on memory storage', done => {
    storage = new Storage();
    expect(storage._storage instanceof MemoryStorage).toBe(true);
    done();
  });

  it('should fallback on cookie storage', done => {
    storage = new Storage({});
    expect(storage._storage instanceof CookieStorage).toBe(true);
    done();
  });

  it('should obtain a local storage if available', done => {
    storage = new Storage({localStorage: true});
    expect(storage._storage instanceof LocalStorage).toBe(true);
    done();
  });

  describe('Storage Types', () => {

    it('should properly obtain a memory storage', done => {
      const storage = new MemoryStorage();
      storage.set('test', 123);
      expect(storage.get('test')).toBe(123);
      storage.flush();
      expect(storage.get('test')).toBe(undefined);
      storage.set('test', 1234);
      expect(storage.get('test')).toBe(1234);
      storage.delete('test');
      expect(storage.get('test')).toBe(undefined);
      done();
    });

    it('should properly obtain a local storage', done => {
      const val = JSON.stringify({value: 123, date: Date.now(), version: '1'});
      const win = {
        localStorage: {
          [`${CACHE_KEY}:test`]: val,
          getItem: jasmine.createSpy().and.returnValue(val),
          setItem: jasmine.createSpy(),
          removeItem: jasmine.createSpy()
        }
      };
      const storage = new LocalStorage(win);
      storage.set('test', 123);
      expect(win.localStorage.getItem).toHaveBeenCalledTimes(0);
      expect(win.localStorage.setItem)
        .toHaveBeenCalledWith(CACHE_KEY + ':test', jasmine.any(String));
      expect(storage.getRaw('test')).toEqual(jasmine.objectContaining({
        value: 123,
        date: jasmine.any(Number),
        version: jasmine.any(String)
      }));
      expect(storage.get('test')).toBe(123);
      expect(storage.hasValidVersion('test', '1')).toBe(true);
      expect(storage.hasValidVersion('test', '2')).toBe(false);
      expect(storage.hasValidVersion('test')).toBe(false);
      storage.flushOlderThan(new Date(Date.now() + 100000));
      expect(win.localStorage.removeItem.calls.count()).toEqual(0);
      storage.flushOlderThan(new Date(Date.now() - 100000));
      expect(win.localStorage.removeItem.calls.count()).toEqual(1);
      storage.flushOldVersions();
      expect(win.localStorage.removeItem.calls.count()).toEqual(2);
      storage.flush();
      expect(win.localStorage.removeItem.calls.count()).toEqual(3);
      expect(win.localStorage.removeItem)
        .toHaveBeenCalledWith(CACHE_KEY + ':test');
      done();
    });

    it('should properly obtain a local storage', done => {
      class Doc {
        constructor() {
          this._val = '';
        }

        get cookie() {
          return this._val;
        }

        set cookie(val) {
          this._val = val;
        }
      }

      const doc = new Doc();
      const win = {document: doc};
      const getSpy = spyOnProperty(doc, 'cookie', 'get').and.callThrough();
      const setSpy = spyOnProperty(doc, 'cookie', 'set').and.callThrough();
      const storage = new CookieStorage(win);
      storage.set('test', 123);
      const cookieVal = encodeURIComponent(JSON.stringify({
        test: {
          val: 123,
          d: 909090909,
          v: '__version__'
        }
      })).replace('__version__', '.*').replace('909090909', '\\d+');
      expect(getSpy).toHaveBeenCalledTimes(1);
      let reg = new RegExp(`^${CACHE_KEY}=${cookieVal}; expires=.*; path=/$`);
      expect(setSpy.calls.mostRecent().args[0]).toMatch(reg);
      storage.flush();
      reg = new RegExp(`^${CACHE_KEY}=; expires=.*; path=/$`);
      expect(setSpy.calls.mostRecent().args[0]).toMatch(reg);
      done();
    });

  });

});
