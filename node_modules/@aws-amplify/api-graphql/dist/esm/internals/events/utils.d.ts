import { DocumentType, GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import type { ResolvedGraphQLAuthModes } from './types';
export declare const normalizeAuth: (explicitAuthMode: GraphQLAuthMode | undefined, defaultAuthMode: ResolvedGraphQLAuthModes) => ResolvedGraphQLAuthModes;
export declare const configure: () => {
    appSyncGraphqlEndpoint: string;
    region: string | undefined;
    authenticationType: ResolvedGraphQLAuthModes;
    apiKey: string | undefined;
};
/**
 * Event API expects an array of JSON strings
 *
 * @param events - JSON-serializable value or an array of values
 * @returns array of JSON strings
 */
export declare const serializeEvents: (events: DocumentType | DocumentType[]) => string[];
