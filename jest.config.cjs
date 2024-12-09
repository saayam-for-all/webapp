module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(node-fetch)/)"  // Asegura que Jest transforme node-fetch
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', 
    "^axios$": "axios/dist/node/axios.cjs",
  },
  testEnvironment: 'jsdom',
};
