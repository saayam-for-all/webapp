import { AuthConfig, Identity, KeyValueStorageInterface } from '@aws-amplify/core';
import { AuthKeys } from '../tokenProvider/types';
import { IdentityIdStore } from './types';
export declare class DefaultIdentityIdStore implements IdentityIdStore {
    keyValueStorage: KeyValueStorageInterface;
    authConfig?: AuthConfig;
    _primaryIdentityId: string | undefined;
    _authKeys: AuthKeys<string>;
    _hasGuestIdentityId: boolean;
    setAuthConfig(authConfigParam: AuthConfig): void;
    constructor(keyValueStorage: KeyValueStorageInterface);
    loadIdentityId(): Promise<Identity | null>;
    storeIdentityId(identity: Identity): Promise<void>;
    clearIdentityId(): Promise<void>;
}
