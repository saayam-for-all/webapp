import { AuthConfig, KeyValueStorageInterface } from '@aws-amplify/core';
import { AuthKeys, AuthTokenStore, CognitoAuthTokens, DeviceMetadata, OAuthMetadata } from './types';
export declare class DefaultTokenStore implements AuthTokenStore {
    private authConfig?;
    keyValueStorage?: KeyValueStorageInterface;
    getKeyValueStorage(): KeyValueStorageInterface;
    setKeyValueStorage(keyValueStorage: KeyValueStorageInterface): void;
    setAuthConfig(authConfig: AuthConfig): void;
    loadTokens(): Promise<CognitoAuthTokens | null>;
    storeTokens(tokens: CognitoAuthTokens): Promise<void>;
    clearTokens(): Promise<void>;
    getDeviceMetadata(username?: string): Promise<DeviceMetadata | null>;
    clearDeviceMetadata(username?: string): Promise<void>;
    private getAuthKeys;
    private getLastAuthUserKey;
    getLastAuthUser(): Promise<string>;
    setOAuthMetadata(metadata: OAuthMetadata): Promise<void>;
    getOAuthMetadata(): Promise<OAuthMetadata | null>;
}
export declare const createKeysForAuthStorage: (provider: string, identifier: string) => AuthKeys<"accessToken" | "idToken" | "oidcProvider" | "clockDrift" | "refreshToken" | "deviceKey" | "randomPasswordKey" | "deviceGroupKey" | "signInDetails" | "oauthMetadata">;
export declare function getAuthStorageKeys<T extends Record<string, string>>(authKeys: T): (prefix: string, identifier: string) => AuthKeys<keyof T & string>;
