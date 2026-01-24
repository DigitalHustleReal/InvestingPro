module.exports = {
  Redis: class Redis {
    constructor() {}
    get() { return Promise.resolve(null); }
    set() { return Promise.resolve('OK'); }
    del() { return Promise.resolve(1); }
    sadd() { return Promise.resolve(1); }
    setex() { return Promise.resolve('OK'); }
    keys() { return Promise.resolve([]); }
    sismember() { return Promise.resolve(0); }
    dbsize() { return Promise.resolve(0); }
    flushdb() { return Promise.resolve('OK'); }
  }
};
