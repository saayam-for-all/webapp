export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileTransformer.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(node-fetch)/)"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
