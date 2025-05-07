/**
 * Passkey Create Types
 */
export { PkcAttestationResponse, PasskeyCreateOptionsJson, PasskeyCreateResultJson, assertValidCredentialCreationOptions, } from './shared';
export type PkcWithAuthenticatorAttestationResponse = Omit<PublicKeyCredential, 'response'> & {
    response: AuthenticatorAttestationResponse;
};
export declare function assertCredentialIsPkcWithAuthenticatorAttestationResponse(credential: any): asserts credential is PkcWithAuthenticatorAttestationResponse;
/**
 * Passkey Get Types
 */
export { PkcAssertionResponse, PasskeyGetOptionsJson, PasskeyGetResultJson, } from './shared';
export type PkcWithAuthenticatorAssertionResponse = Omit<PublicKeyCredential, 'response'> & {
    response: AuthenticatorAssertionResponse;
};
export declare function assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential: any): asserts credential is PkcWithAuthenticatorAssertionResponse;
