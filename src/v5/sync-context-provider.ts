let _context: any;

const run = <T>(context: T, cb: () => void) => {
  _context = context;
  cb();
};

const get = <T>() => _context as T;

export default { run, get };
