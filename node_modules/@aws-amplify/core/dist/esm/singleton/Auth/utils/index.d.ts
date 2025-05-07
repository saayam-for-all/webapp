import { StrictUnion } from '../../../types';
import { AuthConfig, CognitoIdentityPoolConfig, CognitoUserPoolAndIdentityPoolConfig, CognitoUserPoolConfig, JWT, OAuthConfig } from '../types';
export declare function assertTokenProviderConfig(cognitoConfig?: StrictUnion<CognitoUserPoolConfig | CognitoUserPoolAndIdentityPoolConfig | CognitoIdentityPoolConfig>): asserts cognitoConfig is CognitoUserPoolAndIdentityPoolConfig | CognitoUserPoolConfig;
export declare function assertOAuthConfig(cognitoConfig?: AuthConfig['Cognito']): asserts cognitoConfig is AuthConfig['Cognito'] & {
    loginWith: {
        oauth: OAuthConfig;
    };
};
export declare function assertIdentityPoolIdConfig(cognitoConfig?: StrictUnion<CognitoUserPoolConfig | CognitoUserPoolAndIdentityPoolConfig | CognitoIdentityPoolConfig>): asserts cognitoConfig is CognitoIdentityPoolConfig;
/**
 * Decodes payload of JWT token
 *
 * @param {String} token A string representing a token to be decoded
 * @throws {@link Error} - Throws error when token is invalid or payload malformed.
 */
export declare function decodeJWT(token: string): JWT;
