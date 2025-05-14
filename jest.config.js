export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(node-fetch)/)",
    "node_modules/(?!(swiper)/)",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
