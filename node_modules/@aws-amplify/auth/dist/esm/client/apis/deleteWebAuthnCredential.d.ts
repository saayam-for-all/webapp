import { DeleteWebAuthnCredentialInput } from '../../foundation/types';
/**
 * Delete a registered credential for an authenticated user by credentialId
 * @param {DeleteWebAuthnCredentialInput} input The delete input parameters including the credentialId
 * @returns Promise<void>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link DeleteWebAuthnCredentialException}
 * - Thrown due to a service error when deleting a WebAuthn credential
 */
export declare function deleteWebAuthnCredential(input: DeleteWebAuthnCredentialInput): Promise<void>;
