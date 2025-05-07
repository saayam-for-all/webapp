import { PasskeyCreateOptionsJson, PasskeyCreateResultJson } from './types';
/**
 * Registers a new passkey for user
 * @param input - PasskeyCreateOptionsJson
 * @returns serialized PasskeyCreateResult
 */
export declare const registerPasskey: (input: PasskeyCreateOptionsJson) => Promise<PasskeyCreateResultJson>;
