import { SupportedCategory } from '../types';
/**
 * Creates an endpoint id and guarantees multiple creations for a category returns the same uuid.
 *
 * @internal
 */
export declare const createEndpointId: (appId: string, category: SupportedCategory) => string;
/**
 * Clears a created endpoint id for a category.
 *
 * @internal
 */
export declare const clearCreatedEndpointId: (appId: string, category: SupportedCategory) => void;
