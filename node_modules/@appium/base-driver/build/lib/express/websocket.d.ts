export type AppiumServer = import("@appium/types").AppiumServer;
export function addWebSocketHandler(this: import("@appium/types").AppiumServer, handlerPathname: string, handlerServer: import("ws").Server): Promise<void>;
export function removeWebSocketHandler(this: import("@appium/types").AppiumServer, handlerPathname: string): Promise<boolean>;
export function removeAllWebSocketHandlers(this: import("@appium/types").AppiumServer): Promise<boolean>;
export function getWebSocketHandlers(this: import("@appium/types").AppiumServer, keysFilter?: string | null): Promise<Record<string, import("ws").Server>>;
export const DEFAULT_WS_PATHNAME_PREFIX: "/ws";
//# sourceMappingURL=websocket.d.ts.map