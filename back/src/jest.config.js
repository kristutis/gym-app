module.exports = {
  // ...
  transform: {
    '^.+\\(t|j)sx?$': 'ts-jest', // transpile both `ts` + `js` files
  },
  transformIgnorePatterns: [`/node_modules/(?!(sip\.js))`] // Keep `sip.js` to get transpiled as well
};
