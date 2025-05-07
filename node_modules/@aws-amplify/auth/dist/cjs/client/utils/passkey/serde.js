'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePkcWithAssertionToJson = exports.deserializeJsonToPkcGetOptions = exports.serializePkcWithAttestationToJson = exports.deserializeJsonToPkcCreationOptions = void 0;
const convert_1 = require("../../../foundation/convert");
/**
 * Deserializes Public Key Credential Creation Options JSON
 * @param input PasskeyCreateOptionsJson
 * @returns PublicKeyCredentialCreationOptions
 */
const deserializeJsonToPkcCreationOptions = (input) => {
    const userIdBuffer = (0, convert_1.convertBase64UrlToArrayBuffer)(input.user.id);
    const challengeBuffer = (0, convert_1.convertBase64UrlToArrayBuffer)(input.challenge);
    const excludeCredentialsWithBuffer = (input.excludeCredentials || []).map(excludeCred => ({
        ...excludeCred,
        id: (0, convert_1.convertBase64UrlToArrayBuffer)(excludeCred.id),
    }));
    return {
        ...input,
        excludeCredentials: excludeCredentialsWithBuffer,
        challenge: challengeBuffer,
        user: {
            ...input.user,
            id: userIdBuffer,
        },
    };
};
exports.deserializeJsonToPkcCreationOptions = deserializeJsonToPkcCreationOptions;
/**
 * Serializes a Public Key Credential With Attestation to JSON
 * @param input PasskeyCreateResult
 * @returns PasskeyCreateResultJson
 */
const serializePkcWithAttestationToJson = (input) => {
    const response = {
        clientDataJSON: (0, convert_1.convertArrayBufferToBase64Url)(input.response.clientDataJSON),
        attestationObject: (0, convert_1.convertArrayBufferToBase64Url)(input.response.attestationObject),
        transports: input.response.getTransports(),
        publicKeyAlgorithm: input.response.getPublicKeyAlgorithm(),
        authenticatorData: (0, convert_1.convertArrayBufferToBase64Url)(input.response.getAuthenticatorData()),
    };
    const publicKey = input.response.getPublicKey();
    if (publicKey) {
        response.publicKey = (0, convert_1.convertArrayBufferToBase64Url)(publicKey);
    }
    const resultJson = {
        type: input.type,
        id: input.id,
        rawId: (0, convert_1.convertArrayBufferToBase64Url)(input.rawId),
        clientExtensionResults: input.getClientExtensionResults(),
        response,
    };
    if (input.authenticatorAttachment) {
        resultJson.authenticatorAttachment = input.authenticatorAttachment;
    }
    return resultJson;
};
exports.serializePkcWithAttestationToJson = serializePkcWithAttestationToJson;
/**
 * Deserializes Public Key Credential Get Options JSON
 * @param input PasskeyGetOptionsJson
 * @returns PublicKeyCredentialRequestOptions
 */
const deserializeJsonToPkcGetOptions = (input) => {
    const challengeBuffer = (0, convert_1.convertBase64UrlToArrayBuffer)(input.challenge);
    const allowedCredentialsWithBuffer = (input.allowCredentials || []).map(allowedCred => ({
        ...allowedCred,
        id: (0, convert_1.convertBase64UrlToArrayBuffer)(allowedCred.id),
    }));
    return {
        ...input,
        challenge: challengeBuffer,
        allowCredentials: allowedCredentialsWithBuffer,
    };
};
exports.deserializeJsonToPkcGetOptions = deserializeJsonToPkcGetOptions;
/**
 * Serializes a Public Key Credential With Attestation to JSON
 * @param input PasskeyGetResult
 * @returns PasskeyGetResultJson
 */
const serializePkcWithAssertionToJson = (input) => {
    const response = {
        clientDataJSON: (0, convert_1.convertArrayBufferToBase64Url)(input.response.clientDataJSON),
        authenticatorData: (0, convert_1.convertArrayBufferToBase64Url)(input.response.authenticatorData),
        signature: (0, convert_1.convertArrayBufferToBase64Url)(input.response.signature),
    };
    if (input.response.userHandle) {
        response.userHandle = (0, convert_1.convertArrayBufferToBase64Url)(input.response.userHandle);
    }
    const resultJson = {
        id: input.id,
        rawId: (0, convert_1.convertArrayBufferToBase64Url)(input.rawId),
        type: input.type,
        clientExtensionResults: input.getClientExtensionResults(),
        response,
    };
    if (input.authenticatorAttachment) {
        resultJson.authenticatorAttachment = input.authenticatorAttachment;
    }
    return resultJson;
};
exports.serializePkcWithAssertionToJson = serializePkcWithAssertionToJson;
//# sourceMappingURL=serde.js.map
