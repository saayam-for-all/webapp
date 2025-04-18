export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    // "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileTransformer.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(node-fetch)/)"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
