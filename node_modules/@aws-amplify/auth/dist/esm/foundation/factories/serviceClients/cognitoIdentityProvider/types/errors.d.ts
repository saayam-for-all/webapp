export declare enum StartWebAuthnRegistrationException {
    ForbiddenException = "ForbiddenException",
    InternalErrorException = "InternalErrorException",
    InvalidParameterException = "InvalidParameterException",
    LimitExceededException = "LimitExceededException",
    NotAuthorizedException = "NotAuthorizedException",
    TooManyRequestsException = "TooManyRequestsException",
    WebAuthnNotEnabledException = "WebAuthnNotEnabledException",
    WebAuthnConfigurationMissingException = "WebAuthnConfigurationMissingException"
}
export declare enum CompleteWebAuthnRegistrationException {
    ForbiddenException = "ForbiddenException",
    InternalErrorException = "InternalErrorException",
    InvalidParameterException = "InvalidParameterException",
    LimitExceededException = "LimitExceededException",
    NotAuthorizedException = "NotAuthorizedException",
    TooManyRequestsException = "TooManyRequestsException",
    WebAuthnNotEnabledException = "WebAuthnNotEnabledException",
    WebAuthnChallengeNotFoundException = "WebAuthnChallengeNotFoundException",
    WebAuthnRelyingPartyMismatchException = "WebAuthnRelyingPartyMismatchException",
    WebAuthnClientMismatchException = "WebAuthnClientMismatchException",
    WebAuthnOriginNotAllowedException = "WebAuthnOriginNotAllowedException",
    WebAuthnCredentialNotSupportedException = "WebAuthnCredentialNotSupportedException"
}
export declare enum ListWebAuthnCredentialsException {
    ForbiddenException = "ForbiddenException",
    InternalErrorException = "InternalErrorException",
    InvalidParameterException = "InvalidParameterException",
    NotAuthorizedException = "NotAuthorizedException"
}
export declare enum DeleteWebAuthnCredentialException {
    ForbiddenException = "ForbiddenException",
    InternalErrorException = "InternalErrorException",
    InvalidParameterException = "InvalidParameterException",
    NotAuthorizedException = "NotAuthorizedException",
    ResourceNotFoundException = "ResourceNotFoundException"
}
