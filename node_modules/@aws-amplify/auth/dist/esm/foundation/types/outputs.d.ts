import { AuthWebAuthnCredential } from './models';
/**
 * Output type for Cognito listWebAuthnCredentials API.
 */
export interface ListWebAuthnCredentialsOutput {
    credentials: AuthWebAuthnCredential[];
    nextToken?: string;
}
