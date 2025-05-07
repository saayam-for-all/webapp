import { GraphQLResult } from '../../types';
/**
 * Checks to see if the given response or subscription message contains an
 * Unauthorized error. If it does, it changes the error message to include instructions
 * for the app developer.
 */
export declare function repackageUnauthorizedError<T extends GraphQLResult<any>>(content: T): T;
