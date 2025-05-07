import { AuthConfig, AuthTokens, FetchAuthSessionOptions } from '@aws-amplify/core';
import { CognitoAuthSignInDetails } from '../types';
import { AuthTokenOrchestrator, AuthTokenStore, CognitoAuthTokens, DeviceMetadata, OAuthMetadata, TokenRefresher } from './types';
export declare class TokenOrchestrator implements AuthTokenOrchestrator {
    private authConfig?;
    tokenStore?: AuthTokenStore;
    tokenRefresher?: TokenRefresher;
    inflightPromise: Promise<void> | undefined;
    waitForInflightOAuth: () => Promise<void>;
    setAuthConfig(authConfig: AuthConfig): void;
    setTokenRefresher(tokenRefresher: TokenRefresher): void;
    setAuthTokenStore(tokenStore: AuthTokenStore): void;
    getTokenStore(): AuthTokenStore;
    getTokenRefresher(): TokenRefresher;
    getTokens(options?: FetchAuthSessionOptions): Promise<(AuthTokens & {
        signInDetails?: CognitoAuthSignInDetails;
    }) | null>;
    private refreshTokens;
    private handleErrors;
    setTokens({ tokens }: {
        tokens: CognitoAuthTokens;
    }): Promise<void>;
    clearTokens(): Promise<void>;
    getDeviceMetadata(username?: string): Promise<DeviceMetadata | null>;
    clearDeviceMetadata(username?: string): Promise<void>;
    setOAuthMetadata(metadata: OAuthMetadata): Promise<void>;
    getOAuthMetadata(): Promise<OAuthMetadata | null>;
}
