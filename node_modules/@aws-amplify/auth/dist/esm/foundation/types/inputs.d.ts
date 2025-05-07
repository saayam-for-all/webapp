/**
 * Input type for Cognito listWebAuthnCredentials API.
 */
export interface ListWebAuthnCredentialsInput {
    pageSize?: number;
    nextToken?: string;
}
export interface DeleteWebAuthnCredentialInput {
    credentialId: string;
}
