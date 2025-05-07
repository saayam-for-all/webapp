// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var StartWebAuthnRegistrationException;
(function (StartWebAuthnRegistrationException) {
    StartWebAuthnRegistrationException["ForbiddenException"] = "ForbiddenException";
    StartWebAuthnRegistrationException["InternalErrorException"] = "InternalErrorException";
    StartWebAuthnRegistrationException["InvalidParameterException"] = "InvalidParameterException";
    StartWebAuthnRegistrationException["LimitExceededException"] = "LimitExceededException";
    StartWebAuthnRegistrationException["NotAuthorizedException"] = "NotAuthorizedException";
    StartWebAuthnRegistrationException["TooManyRequestsException"] = "TooManyRequestsException";
    StartWebAuthnRegistrationException["WebAuthnNotEnabledException"] = "WebAuthnNotEnabledException";
    StartWebAuthnRegistrationException["WebAuthnConfigurationMissingException"] = "WebAuthnConfigurationMissingException";
})(StartWebAuthnRegistrationException || (StartWebAuthnRegistrationException = {}));
var CompleteWebAuthnRegistrationException;
(function (CompleteWebAuthnRegistrationException) {
    CompleteWebAuthnRegistrationException["ForbiddenException"] = "ForbiddenException";
    CompleteWebAuthnRegistrationException["InternalErrorException"] = "InternalErrorException";
    CompleteWebAuthnRegistrationException["InvalidParameterException"] = "InvalidParameterException";
    CompleteWebAuthnRegistrationException["LimitExceededException"] = "LimitExceededException";
    CompleteWebAuthnRegistrationException["NotAuthorizedException"] = "NotAuthorizedException";
    CompleteWebAuthnRegistrationException["TooManyRequestsException"] = "TooManyRequestsException";
    CompleteWebAuthnRegistrationException["WebAuthnNotEnabledException"] = "WebAuthnNotEnabledException";
    CompleteWebAuthnRegistrationException["WebAuthnChallengeNotFoundException"] = "WebAuthnChallengeNotFoundException";
    CompleteWebAuthnRegistrationException["WebAuthnRelyingPartyMismatchException"] = "WebAuthnRelyingPartyMismatchException";
    CompleteWebAuthnRegistrationException["WebAuthnClientMismatchException"] = "WebAuthnClientMismatchException";
    CompleteWebAuthnRegistrationException["WebAuthnOriginNotAllowedException"] = "WebAuthnOriginNotAllowedException";
    CompleteWebAuthnRegistrationException["WebAuthnCredentialNotSupportedException"] = "WebAuthnCredentialNotSupportedException";
})(CompleteWebAuthnRegistrationException || (CompleteWebAuthnRegistrationException = {}));
var ListWebAuthnCredentialsException;
(function (ListWebAuthnCredentialsException) {
    ListWebAuthnCredentialsException["ForbiddenException"] = "ForbiddenException";
    ListWebAuthnCredentialsException["InternalErrorException"] = "InternalErrorException";
    ListWebAuthnCredentialsException["InvalidParameterException"] = "InvalidParameterException";
    ListWebAuthnCredentialsException["NotAuthorizedException"] = "NotAuthorizedException";
})(ListWebAuthnCredentialsException || (ListWebAuthnCredentialsException = {}));
var DeleteWebAuthnCredentialException;
(function (DeleteWebAuthnCredentialException) {
    DeleteWebAuthnCredentialException["ForbiddenException"] = "ForbiddenException";
    DeleteWebAuthnCredentialException["InternalErrorException"] = "InternalErrorException";
    DeleteWebAuthnCredentialException["InvalidParameterException"] = "InvalidParameterException";
    DeleteWebAuthnCredentialException["NotAuthorizedException"] = "NotAuthorizedException";
    DeleteWebAuthnCredentialException["ResourceNotFoundException"] = "ResourceNotFoundException";
})(DeleteWebAuthnCredentialException || (DeleteWebAuthnCredentialException = {}));

export { CompleteWebAuthnRegistrationException, DeleteWebAuthnCredentialException, ListWebAuthnCredentialsException, StartWebAuthnRegistrationException };
//# sourceMappingURL=errors.mjs.map
