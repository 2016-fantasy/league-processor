require('babel/polyfill');

module.exports = function* z(g1, g2) {
  do {
    const {value: g1v, done: g1d} = g1.next(),
          {value: g2v, done: g2d} = g2.next();

    if (g1d && g2d) return [g1v, g2v];

    yield [g1v, g2v];

    if (g1d) {
      do {
        let {value, done} = g2.next();
        if (done) return [undefined, value];
        yield [undefined, value];
      } while (true);
    }
    else if (g2d) {
      do {
        let {value, done} = g1.next();
        if (done) return [value, undefined];
        yield [value, undefined];
      } while (true);
    }
  } while (true);
};