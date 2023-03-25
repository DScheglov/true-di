let _context: any;

const run = <T, R>(context: T, cb: () => R) => {
  _context = context;
  return cb();
};

const get = <T>() => _context as T;

export default { run, get };
