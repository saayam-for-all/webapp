import { AmplifyError, AmplifyErrorParams, AssertionFunction } from '@aws-amplify/core/internals/utils';
export declare class PasskeyError extends AmplifyError {
    constructor(params: AmplifyErrorParams);
}
export declare enum PasskeyErrorCode {
    PasskeyNotSupported = "PasskeyNotSupported",
    PasskeyAlreadyExists = "PasskeyAlreadyExists",
    InvalidPasskeyRegistrationOptions = "InvalidPasskeyRegistrationOptions",
    InvalidPasskeyAuthenticationOptions = "InvalidPasskeyAuthenticationOptions",
    RelyingPartyMismatch = "RelyingPartyMismatch",
    PasskeyRegistrationFailed = "PasskeyRegistrationFailed",
    PasskeyRetrievalFailed = "PasskeyRetrievalFailed",
    PasskeyRegistrationCanceled = "PasskeyRegistrationCanceled",
    PasskeyAuthenticationCanceled = "PasskeyAuthenticationCanceled",
    PasskeyOperationAborted = "PasskeyOperationAborted"
}
export declare const assertPasskeyError: AssertionFunction<PasskeyErrorCode>;
/**
 * Handle Passkey Authentication Errors
 * https://w3c.github.io/webauthn/#sctn-get-request-exceptions
 *
 * @param err unknown
 * @returns PasskeyError
 */
export declare const handlePasskeyAuthenticationError: (err: unknown) => PasskeyError;
/**
 * Handle Passkey Registration Errors
 * https://w3c.github.io/webauthn/#sctn-create-request-exceptions
 *
 * @param err unknown
 * @returns PasskeyError
 */
export declare const handlePasskeyRegistrationError: (err: unknown) => PasskeyError;
