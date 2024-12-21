// jest.config.js
module.exports = {
    // Define how files are transformed before running the tests
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest", // For transforming JS/JSX files using Babel
    },
    // Handle node_modules that use ES modules like axios
    transformIgnorePatterns: [
      "node_modules/(?!axios)" // Don't ignore axios for transformation
    ],
  };
  