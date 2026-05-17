describe("volunteerLocationTracker", () => {
  let tracker;
  let api;
  let endpoints;
  let getSpatialIntervalMs;
  let getMinDistanceMeters;

  const loadModule = async (authState) => {
    jest.resetModules();

    jest.doMock("./api", () => ({
      __esModule: true,
      default: {
        post: jest.fn(),
      },
    }));

    jest.doMock("./endpoints.json", () => ({
      __esModule: true,
      default: {
        UPDATE_VOLUNTEER_LOCATION: "v1/spatial/updateVolunteerLocation",
      },
    }));

    jest.doMock("../redux/store", () => ({
      store: {
        getState: jest.fn(() => authState),
      },
    }));

    jest.doMock("#utils/appEnvConfig.js", () => ({
      getSpatialIntervalMs: jest.fn(() => 300000),
      getMinDistanceMeters: jest.fn(() => 50),
    }));

    tracker = await import("./volunteerLocationTracker");
    api = (await import("./api")).default;
    endpoints = (await import("./endpoints.json")).default;

    const appEnv = await import("#utils/appEnvConfig.js");
    getSpatialIntervalMs = appEnv.getSpatialIntervalMs;
    getMinDistanceMeters = appEnv.getMinDistanceMeters;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest.fn(),
      },
      configurable: true,
    });

    window.setInterval = jest.fn(() => 111);
    window.clearInterval = jest.fn();

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    if (tracker?.stopVolunteerLocationTracking) {
      tracker.stopVolunteerLocationTracking();
    }

    jest.restoreAllMocks();
  });

  describe("startVolunteerLocationTracking", () => {
    it("does nothing for non-volunteer users", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-999",
            groups: ["Users"],
          },
        },
      });

      await tracker.startVolunteerLocationTracking();

      expect(api.post).not.toHaveBeenCalled();
      expect(window.setInterval).not.toHaveBeenCalled();
    });

    it("does not call API when volunteer user id is missing but still starts interval", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "",
            groups: ["Volunteers"],
          },
        },
      });

      await tracker.startVolunteerLocationTracking();

      expect(api.post).not.toHaveBeenCalled();
      expect(window.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        300000,
      );
    });

    it("gets browser coordinates, updates API, stores coords, and starts interval", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 35.123456,
            longitude: -80.987654,
          },
        });
      });

      api.post.mockResolvedValue({
        data: {
          data: {
            latitude: 35.1235,
            longitude: -80.9877,
          },
        },
      });

      await tracker.startVolunteerLocationTracking();

      expect(api.post).toHaveBeenCalledWith(
        endpoints.UPDATE_VOLUNTEER_LOCATION,
        {
          user_id: "SID-123",
          latitude: 35.1235,
          longitude: -80.9877,
        },
      );

      const stored = JSON.parse(
        localStorage.getItem("latestVolunteerLocation"),
      );
      expect(stored).toMatchObject({
        latitude: 35.1235,
        longitude: -80.9877,
        address: "",
        mode: "coords",
      });

      expect(window.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        300000,
      );
    });

    it("uses provided intervalMs instead of app env interval", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 10.11111,
            longitude: 20.22222,
          },
        });
      });

      api.post.mockResolvedValue({
        data: {
          data: {
            latitude: 10.1111,
            longitude: 20.2222,
          },
        },
      });

      await tracker.startVolunteerLocationTracking({ intervalMs: 10000 });

      expect(window.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        10000,
      );
      expect(getSpatialIntervalMs).not.toHaveBeenCalled();
    });

    it("falls back to address when geolocation fails", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      localStorage.setItem(
        "personalInfo",
        JSON.stringify({
          city: "Knoxville",
          state: "TN",
          country: "USA",
          zipCode: "37923",
        }),
      );

      navigator.geolocation.getCurrentPosition.mockImplementation(
        (_success, error) => {
          error({ code: 1, PERMISSION_DENIED: 1 });
        },
      );

      api.post.mockResolvedValue({
        data: { success: true },
      });

      await tracker.startVolunteerLocationTracking();

      expect(api.post).toHaveBeenCalledWith(
        endpoints.UPDATE_VOLUNTEER_LOCATION,
        {
          user_id: "SID-123",
          address: "Knoxville, TN, USA, 37923",
        },
      );

      const stored = JSON.parse(
        localStorage.getItem("latestVolunteerLocation"),
      );
      expect(stored).toMatchObject({
        latitude: null,
        longitude: null,
        address: "Knoxville, TN, USA, 37923",
        mode: "address",
      });
    });

    it("skips duplicate start when interval already exists", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 12.1111,
            longitude: 77.2222,
          },
        });
      });

      api.post.mockResolvedValue({
        data: {
          data: {
            latitude: 12.1111,
            longitude: 77.2222,
          },
        },
      });

      await tracker.startVolunteerLocationTracking();
      await tracker.startVolunteerLocationTracking();

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(window.setInterval).toHaveBeenCalledTimes(1);
    });

    it("skips API call when stored coords have not changed enough", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      localStorage.setItem(
        "latestVolunteerLocation",
        JSON.stringify({
          latitude: 35.1234,
          longitude: -80.9876,
          address: "",
          mode: "coords",
          updatedAt: new Date().toISOString(),
        }),
      );

      getMinDistanceMeters.mockReturnValue(1000);

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 35.12341,
            longitude: -80.98761,
          },
        });
      });

      await tracker.startVolunteerLocationTracking();

      expect(api.post).not.toHaveBeenCalled();
      expect(window.setInterval).toHaveBeenCalledTimes(1);
    });

    it("skips API call when fallback address has not changed", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      localStorage.setItem(
        "latestVolunteerLocation",
        JSON.stringify({
          latitude: null,
          longitude: null,
          address: "Knoxville, TN, USA, 37923",
          mode: "address",
          updatedAt: new Date().toISOString(),
        }),
      );

      localStorage.setItem(
        "personalInfo",
        JSON.stringify({
          city: "Knoxville",
          state: "TN",
          country: "USA",
          zipCode: "37923",
        }),
      );

      navigator.geolocation.getCurrentPosition.mockImplementation(
        (_success, error) => {
          error({ code: 1, PERMISSION_DENIED: 1 });
        },
      );

      await tracker.startVolunteerLocationTracking();

      expect(api.post).not.toHaveBeenCalled();
      expect(window.setInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe("syncVolunteerLocationNow", () => {
    it("runs a manual sync immediately", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 40.55555,
            longitude: -74.66666,
          },
        });
      });

      api.post.mockResolvedValue({
        data: {
          data: {
            latitude: 40.5555,
            longitude: -74.6667,
          },
        },
      });

      await tracker.syncVolunteerLocationNow();

      expect(api.post).toHaveBeenCalledWith(
        endpoints.UPDATE_VOLUNTEER_LOCATION,
        {
          user_id: "SID-123",
          latitude: 40.5555,
          longitude: -74.6667,
        },
      );
    });

    it("does nothing for non-volunteer user", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-999",
            groups: ["Users"],
          },
        },
      });

      await tracker.syncVolunteerLocationNow();

      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe("stopVolunteerLocationTracking", () => {
    it("clears interval when running", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 1,
            longitude: 2,
          },
        });
      });

      api.post.mockResolvedValue({
        data: {
          data: {
            latitude: 1,
            longitude: 2,
          },
        },
      });

      await tracker.startVolunteerLocationTracking();
      tracker.stopVolunteerLocationTracking();

      expect(window.clearInterval).toHaveBeenCalledWith(111);
    });

    it("is safe when no interval exists", async () => {
      await loadModule({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      });

      tracker.stopVolunteerLocationTracking();

      expect(window.clearInterval).not.toHaveBeenCalled();
    });
  });
});
