describe("api module configuration", () => {
  const importApiWithMocks = () => {
    let createMock;

    jest.isolateModules(() => {
      jest.doMock("aws-amplify/auth", () => ({
        fetchAuthSession: jest.fn(),
      }));

      createMock = jest.fn(() => ({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        request: jest.fn(),
      }));

      jest.doMock("axios", () => {
        const axiosMock = { create: createMock };
        return {
          __esModule: true,
          default: axiosMock,
          create: createMock,
        };
      });

      require("./api");
    });

    return createMock;
  };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("uses process env base url when process is available", () => {
    const previous = process.env.VITE_BASE_API_URL;
    process.env.VITE_BASE_API_URL = "https://process-env.example";

    try {
      const createMock = importApiWithMocks();
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(createMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          baseURL: "https://process-env.example",
          headers: { "Content-Type": "application/json" },
        }),
      );
      expect(createMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          baseURL: "https://process-env.example",
          headers: { "Content-Type": "application/json" },
        }),
      );
    } finally {
      if (typeof previous === "undefined") {
        delete process.env.VITE_BASE_API_URL;
      } else {
        process.env.VITE_BASE_API_URL = previous;
      }
    }
  });
});
