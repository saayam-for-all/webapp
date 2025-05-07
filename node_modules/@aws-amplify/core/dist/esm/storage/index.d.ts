import { DefaultStorage } from './DefaultStorage';
import { KeyValueStorage } from './KeyValueStorage';
import { SessionStorage } from './SessionStorage';
import { SyncSessionStorage } from './SyncSessionStorage';
export { CookieStorage } from './CookieStorage';
export declare const defaultStorage: DefaultStorage;
export declare const sessionStorage: SessionStorage;
export declare const syncSessionStorage: SyncSessionStorage;
export declare const sharedInMemoryStorage: KeyValueStorage;
