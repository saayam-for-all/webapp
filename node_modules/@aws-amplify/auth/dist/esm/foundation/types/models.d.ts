/**
 * Shape of a WebAuthn credential
 */
export interface AuthWebAuthnCredential {
    credentialId: string | undefined;
    friendlyCredentialName: string | undefined;
    relyingPartyId: string | undefined;
    authenticatorAttachment?: string;
    authenticatorTransports: string[] | undefined;
    createdAt: Date | undefined;
}
