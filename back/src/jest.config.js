module.exports = {
  // ...
  transform: {
    '^.+\\(t|j)sx?$': 'ts-jest', // transpile both `ts` + `js` files
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/routes/**"],
  "compilerOptions": {
    "lib": [
      "es5", "es6", "dom", "dom.iterable"
  ],
    "module": "commonjs",
    "target": "es6",
    "rootDir": "./",
    "esModuleInterop": true
  }
  transformIgnorePatterns: [`/node_modules/(?!(sip\.js))`] // Keep `sip.js` to get transpiled as well
};
