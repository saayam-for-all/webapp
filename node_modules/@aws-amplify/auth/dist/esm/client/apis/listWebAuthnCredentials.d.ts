import { ListWebAuthnCredentialsInput, ListWebAuthnCredentialsOutput } from '../../foundation/types';
/**
 * Lists registered credentials for an authenticated user
 *
 * @param {ListWebAuthnCredentialsInput} input The list input parameters including page size and next token.
 * @returns Promise<ListWebAuthnCredentialsOutput>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link ListWebAuthnCredentialsException}
 * - Thrown due to a service error when listing WebAuthn credentials
 */
export declare function listWebAuthnCredentials(input?: ListWebAuthnCredentialsInput): Promise<ListWebAuthnCredentialsOutput>;
