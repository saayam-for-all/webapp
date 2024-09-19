export default {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transforms JavaScript/JSX using Babel
    },
    testEnvironment: 'jsdom', // Sets up a browser-like environment for testing
    moduleFileExtensions: ['js', 'jsx'],
  };
  