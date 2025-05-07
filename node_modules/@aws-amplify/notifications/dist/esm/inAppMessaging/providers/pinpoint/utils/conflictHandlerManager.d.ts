import { InAppMessageConflictHandler, SetConflictHandlerInput } from '../types';
/**
 * Sets conflict handler.
 *
 * @internal
 */
export declare const setConflictHandler: (input: SetConflictHandlerInput) => void;
/**
 * Returns the current conflict handler.
 *
 * @internal
 */
export declare const getConflictHandler: () => InAppMessageConflictHandler;
