'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWebAuthnCredentialException = exports.ListWebAuthnCredentialsException = exports.CompleteWebAuthnRegistrationException = exports.StartWebAuthnRegistrationException = void 0;
(function (StartWebAuthnRegistrationException) {
    StartWebAuthnRegistrationException["ForbiddenException"] = "ForbiddenException";
    StartWebAuthnRegistrationException["InternalErrorException"] = "InternalErrorException";
    StartWebAuthnRegistrationException["InvalidParameterException"] = "InvalidParameterException";
    StartWebAuthnRegistrationException["LimitExceededException"] = "LimitExceededException";
    StartWebAuthnRegistrationException["NotAuthorizedException"] = "NotAuthorizedException";
    StartWebAuthnRegistrationException["TooManyRequestsException"] = "TooManyRequestsException";
    StartWebAuthnRegistrationException["WebAuthnNotEnabledException"] = "WebAuthnNotEnabledException";
    StartWebAuthnRegistrationException["WebAuthnConfigurationMissingException"] = "WebAuthnConfigurationMissingException";
})(exports.StartWebAuthnRegistrationException || (exports.StartWebAuthnRegistrationException = {}));
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
})(exports.CompleteWebAuthnRegistrationException || (exports.CompleteWebAuthnRegistrationException = {}));
(function (ListWebAuthnCredentialsException) {
    ListWebAuthnCredentialsException["ForbiddenException"] = "ForbiddenException";
    ListWebAuthnCredentialsException["InternalErrorException"] = "InternalErrorException";
    ListWebAuthnCredentialsException["InvalidParameterException"] = "InvalidParameterException";
    ListWebAuthnCredentialsException["NotAuthorizedException"] = "NotAuthorizedException";
})(exports.ListWebAuthnCredentialsException || (exports.ListWebAuthnCredentialsException = {}));
(function (DeleteWebAuthnCredentialException) {
    DeleteWebAuthnCredentialException["ForbiddenException"] = "ForbiddenException";
    DeleteWebAuthnCredentialException["InternalErrorException"] = "InternalErrorException";
    DeleteWebAuthnCredentialException["InvalidParameterException"] = "InvalidParameterException";
    DeleteWebAuthnCredentialException["NotAuthorizedException"] = "NotAuthorizedException";
    DeleteWebAuthnCredentialException["ResourceNotFoundException"] = "ResourceNotFoundException";
})(exports.DeleteWebAuthnCredentialException || (exports.DeleteWebAuthnCredentialException = {}));
//# sourceMappingURL=errors.js.map
