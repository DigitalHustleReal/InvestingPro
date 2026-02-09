const store = new Map();
const sets = new Map();
const expiries = new Map();

module.exports = {
  Redis: class Redis {
    constructor() {}
    get(key) { 
      if (expiries.has(key) && expiries.get(key) < Date.now()) {
        store.delete(key);
        expiries.delete(key);
        return Promise.resolve(null);
      }
      return Promise.resolve(store.has(key) ? store.get(key) : null); 
    }
    set(key, value, options) { 
      store.set(key, value);
      if (options?.ex) {
        expiries.set(key, Date.now() + options.ex * 1000);
      } else if (options?.px) {
        expiries.set(key, Date.now() + options.px);
      } else {
        expiries.delete(key);
      }
      return Promise.resolve('OK'); 
    }
    setex(key, ttl, value) {
      store.set(key, value);
      expiries.set(key, Date.now() + ttl * 1000);
      return Promise.resolve('OK');
    }
    del(key) { 
      const deleted = store.delete(key);
      expiries.delete(key);
      sets.delete(`cache:tags:${key}`);
      return Promise.resolve(deleted ? 1 : 0); 
    }
    sadd(key, ...members) { 
      if (!sets.has(key)) sets.set(key, new Set());
      members.forEach(m => sets.get(key).add(m));
      return Promise.resolve(members.length); 
    }
    sismember(key, member) {
      const set = sets.get(key);
      return Promise.resolve(set && set.has(member) ? 1 : 0);
    }
    keys(pattern) {
      const allKeys = [...store.keys(), ...sets.keys()];
      if (pattern === '*') return Promise.resolve(allKeys);
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        return Promise.resolve(allKeys.filter(k => k.startsWith(prefix)));
      }
      return Promise.resolve(allKeys.filter(k => k === pattern));
    }
    dbsize() { return Promise.resolve(store.size); }
    flushdb() { 
      store.clear(); 
      sets.clear();
      return Promise.resolve('OK'); 
    }
  }
};

