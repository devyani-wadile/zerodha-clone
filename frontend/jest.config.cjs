module.exports = {
  testEnvironment: "jsdom",

  setupFiles: ["<rootDir>/jest.polyfills.cjs"],

  setupFilesAfterEnv: ["@testing-library/jest-dom"],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  testMatch: ["**/test/**/*.test.jsx"],
};