import { StorageAccessLevel } from '@aws-amplify/core';
interface ResolvePrefixOptions {
    accessLevel: StorageAccessLevel;
    targetIdentityId?: string;
}
export declare const resolvePrefix: ({ accessLevel, targetIdentityId, }: ResolvePrefixOptions) => string;
export {};
