export const LOGLEVEL = {
  OFF: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5,
};
Object.freeze(LOGLEVEL);

const mapping = {
  log: LOGLEVEL.INFO,
  info: LOGLEVEL.INFO,
  debug: LOGLEVEL.DEBUG,
  error: LOGLEVEL.ERROR,
  warn: LOGLEVEL.WARN,
  v: LOGLEVEL.VERBOSE,
};
const mappingKeys = Object.keys(mapping);
const methods = {
  log: console.log,
  info: console.info,
  debug: console.debug,
  error: console.error,
  warn: console.warn,
  v: console.debug,
};

let currentLogLevel = LOGLEVEL.INFO;

const internalLogger = {
  log(...args) {},
  info(...args) {},
  debug(...args) {},
  error(...args) {},
  warn(...args) {},
  v(...args) {},
  setLogLevel(level) {
    currentLogLevel = level;
  },
};

export const Logger = new Proxy(internalLogger, {
  get(target, prop) {
    if (typeof target[prop] === "function" && mappingKeys.includes(prop)) {
      return new Proxy(target[prop], {
        apply: (target, thisArg, argumentsList) => {
          //check if loglevel is ok
          const level = mapping[prop.toString()];
          if (currentLogLevel >= level) {
            return methods[prop](...argumentsList);
          } //else do nothing
        },
      });
    } else {
      return Reflect.get(target, prop);
    }
  },
});
