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
      done();
    });

    it('should properly obtain a local storage', done => {
      const win = {
        localStorage: {
          getItem: jasmine.createSpy(),
          setItem: jasmine.createSpy(),
          removeItem: jasmine.createSpy()
        }
      };
      const storage = new LocalStorage(win);
      storage.set('test', 123);
      const val = JSON.stringify({test: 123});
      expect(win.localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(win.localStorage.setItem).toHaveBeenCalledWith(CACHE_KEY, val);
      storage.flush();
      expect(win.localStorage.removeItem).toHaveBeenCalledWith(CACHE_KEY);
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
      const cookieVal = encodeURIComponent(JSON.stringify({test: 123}));
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
