import { ExtensionCore } from '@appium/base-driver';
import WebSocket from 'ws';
import type { IncomingMessage } from 'node:http';
import type { AppiumDriver } from './appium';
import type { ErrorBiDiCommandResponse, SuccessBiDiCommandResponse, ExternalDriver, Plugin } from '@appium/types';
type ExtensionPlugin = Plugin & ExtensionCore;
type AnyDriver = ExternalDriver | AppiumDriver;
/**
 * Clients cannot use broadcast addresses, like 0.0.0.0 or ::
 * to create connections. Thus we prefer a hostname if such
 * address is provided or the actual address of a non-local interface,
 * in case the host only has one such interface.
 *
 * @param address
 */
export declare function determineBiDiHost(address: string): string;
/**
 * Initialize a new bidi connection and set up handlers
 * @param ws The websocket connection object
 * @param req The connection pathname, which might include the session id
 */
export declare function onBidiConnection(this: AppiumDriver, ws: WebSocket, req: IncomingMessage): void;
/**
 * @param data
 * @param driver
 * @param plugins
 */
export declare function onBidiMessage(this: AppiumDriver, data: Buffer, driver: AnyDriver, plugins: ExtensionPlugin[]): Promise<SuccessBiDiCommandResponse | ErrorBiDiCommandResponse>;
/**
 * Log a bidi server error
 * @param err
 */
export declare function onBidiServerError(this: AppiumDriver, err: Error): void;
/**
 * Clean up any bidi sockets associated with session
 *
 * @param sessionId
 */
export declare function cleanupBidiSockets(this: AppiumDriver, sessionId: string): void;
export {};
//# sourceMappingURL=bidi-commands.d.ts.map