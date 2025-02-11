export default {
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileTransformer.js",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
