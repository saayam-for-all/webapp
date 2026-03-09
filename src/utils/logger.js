const isDev = import.meta.env.DEV;

const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => isDev && console.error(...args),
  warn: (...args) => isDev && console.warn(...args),
  debug: (...args) => isDev && console.debug(...args),
  trace: (...args) => isDev && console.trace(...args),
};

export default logger;
