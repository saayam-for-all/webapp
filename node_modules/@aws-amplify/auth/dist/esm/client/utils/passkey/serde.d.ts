import { PasskeyCreateOptionsJson, PasskeyCreateResultJson, PasskeyGetOptionsJson, PasskeyGetResultJson, PkcWithAuthenticatorAssertionResponse, PkcWithAuthenticatorAttestationResponse } from './types';
/**
 * Deserializes Public Key Credential Creation Options JSON
 * @param input PasskeyCreateOptionsJson
 * @returns PublicKeyCredentialCreationOptions
 */
export declare const deserializeJsonToPkcCreationOptions: (input: PasskeyCreateOptionsJson) => PublicKeyCredentialCreationOptions;
/**
 * Serializes a Public Key Credential With Attestation to JSON
 * @param input PasskeyCreateResult
 * @returns PasskeyCreateResultJson
 */
export declare const serializePkcWithAttestationToJson: (input: PkcWithAuthenticatorAttestationResponse) => PasskeyCreateResultJson;
/**
 * Deserializes Public Key Credential Get Options JSON
 * @param input PasskeyGetOptionsJson
 * @returns PublicKeyCredentialRequestOptions
 */
export declare const deserializeJsonToPkcGetOptions: (input: PasskeyGetOptionsJson) => PublicKeyCredentialRequestOptions;
/**
 * Serializes a Public Key Credential With Attestation to JSON
 * @param input PasskeyGetResult
 * @returns PasskeyGetResultJson
 */
export declare const serializePkcWithAssertionToJson: (input: PkcWithAuthenticatorAssertionResponse) => PasskeyGetResultJson;
