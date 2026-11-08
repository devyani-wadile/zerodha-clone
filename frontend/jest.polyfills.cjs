const { TextEncoder, TextDecoder } = require("util");

Object.defineProperties(globalThis, {
  TextEncoder: {
    value: TextEncoder,
  },
  TextDecoder: {
    value: TextDecoder,
  },
});