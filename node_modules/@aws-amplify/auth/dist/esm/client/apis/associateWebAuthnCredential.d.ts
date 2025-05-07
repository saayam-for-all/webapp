/**
 * Registers a new passkey for an authenticated user
 *
 * @returns Promise<void>
 * @throws - {@link PasskeyError}:
 * - Thrown when intermediate state is invalid
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link StartWebAuthnRegistrationException}
 * - Thrown due to a service error retrieving WebAuthn registration options
 * @throws - {@link CompleteWebAuthnRegistrationException}
 * - Thrown due to a service error when verifying WebAuthn registration result
 */
export declare function associateWebAuthnCredential(): Promise<void>;
