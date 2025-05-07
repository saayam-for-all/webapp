import { AuthModeParams, BaseClient, GraphQLAuthMode, ClientInternalsGetter, ListArgs, ModelIntrospectionSchema, QueryArgs, SchemaModel, SchemaNonModel } from '../bridge-types';
import { CustomHeaders } from '../client';
import type { IndexMeta } from './operations/indexQuery';
/**
 * Crawls a model tree, starting with a given **individual** model instance record, looking
 * for related hasMany children to extract from their `items` containers.
 *
 * E.g., if we have a record like this:
 *
 * ```js
 * {
 *   id: 'some-id',
 *   children: {
 *     items: [
 *       { name: 'a' }
 *       { name: 'b' }
 *       { name: 'c' }
 *     ]
 *   }
 * }
 * ```
 *
 * And if `children` refers to *an array of another model* (as opposed to a custom type),
 * the `items` will be extracted. We do this because `items` is just the mechanism for nesting
 * child records -- we don't want customers to have to dig the items out in application code.
 * Ultimately, we return this "flattened" structure:
 *
 * ```js
 * {
 *   id: 'some-id',
 *   children: [
 *     { name: 'a' }
 *     { name: 'b' }
 *     { name: 'c' }
 *   ]
 * }
 * ```
 *
 * Notably, an identical record could be the result of a nested custom type that contains an
 * `items` property. This will *not* be flattened, because in that case the `items` property is
 * actually part of the customer's schema. Similarly if a model contains an explicit `items` field.
 *
 * @param modelIntrospection Top-level model introspection schema.
 * @param modelName The name of the model. Can be `undefined`. E.g., for customOperation return types.
 * @param modelRecord The individual "model instance record" to normalize.
 */
export declare const flattenItems: (modelIntrospection: ModelIntrospectionSchema, modelName: string | undefined, modelRecord: Record<string, any>) => Record<string, any> | null;
export declare function initializeModel(client: BaseClient, modelName: string, result: any[], modelIntrospection: ModelIntrospectionSchema, authMode: GraphQLAuthMode | undefined, authToken: string | undefined, context?: boolean): any[];
export declare const graphQLOperationsInfo: {
    readonly CREATE: {
        readonly operationPrefix: "create";
        readonly usePlural: false;
    };
    readonly GET: {
        readonly operationPrefix: "get";
        readonly usePlural: false;
    };
    readonly UPDATE: {
        readonly operationPrefix: "update";
        readonly usePlural: false;
    };
    readonly DELETE: {
        readonly operationPrefix: "delete";
        readonly usePlural: false;
    };
    readonly LIST: {
        readonly operationPrefix: "list";
        readonly usePlural: true;
    };
    readonly INDEX_QUERY: {
        readonly operationPrefix: "";
        readonly usePlural: false;
    };
    readonly ONCREATE: {
        readonly operationPrefix: "onCreate";
        readonly usePlural: false;
    };
    readonly ONUPDATE: {
        readonly operationPrefix: "onUpdate";
        readonly usePlural: false;
    };
    readonly ONDELETE: {
        readonly operationPrefix: "onDelete";
        readonly usePlural: false;
    };
    readonly OBSERVEQUERY: {
        readonly operationPrefix: "observeQuery";
        readonly usePlural: false;
    };
};
export type ModelOperation = keyof typeof graphQLOperationsInfo;
export declare const getDefaultSelectionSetForNonModelWithIR: (nonModelDefinition: SchemaNonModel, modelIntrospection: ModelIntrospectionSchema) => Record<string, unknown>;
/**
 * Generates nested Custom Selection Set IR from path
 *
 * @param modelDefinitions
 * @param modelName
 * @param selectionSet - array of object paths
 * @example
 * ### Given
 * `selectionSet = ['id', 'comments.post.id']`
 * ### Returns
 * ```ts
 * {
 *   id: '',
 *   comments: {
 *     items: { post: { id: '' } }
 *   }
 * }
 * ```
 */
export declare function customSelectionSetToIR(modelIntrospection: ModelIntrospectionSchema, modelName: string, selectionSet: string[]): Record<string, string | object>;
/**
 * Stringifies selection set IR
 * * @example
 * ### Given
 * ```ts
 * {
 *   id: '',
 *   comments: {
 *     items: { post: { id: '' } }
 *   }
 * }
 * ```
 * ### Returns
 * `'id comments { items { post { id } } }'`
 */
export declare function selectionSetIRToString(obj: Record<string, string | any>): string;
export declare function generateSelectionSet(modelIntrospection: ModelIntrospectionSchema, modelName: string, selectionSet?: string[]): string;
export declare function generateGraphQLDocument(modelIntrospection: ModelIntrospectionSchema, modelDefinition: SchemaModel, modelOperation: ModelOperation, listArgs?: ListArgs | QueryArgs, indexMeta?: IndexMeta): string;
export declare function buildGraphQLVariables(modelDefinition: SchemaModel, operation: ModelOperation, arg: QueryArgs | undefined, modelIntrospection: ModelIntrospectionSchema, indexMeta?: IndexMeta): object;
/**
 * Iterates over mutation input values and resolves any model inputs to their corresponding join fields/values
 *
 * @example
 * ### Usage
 * ```ts
 * const result = normalizeMutationInput({ post: post }, model, modelDefinition);
 * ```
 * ### Result
 * ```ts
 * { postId: "abc123" }
 * ```
 *
 */
export declare function normalizeMutationInput(mutationInput: QueryArgs, model: SchemaModel, modelIntrospection: ModelIntrospectionSchema): QueryArgs;
/**
 * Produces a parameter object that can contains auth mode/token overrides
 * only if present in either `options` (first) or configured on the `client`
 * as a fallback.
 *
 * @param client Configured client from `generateClient`
 * @param options Args/Options object from call site.
 * @returns
 */
export declare function authModeParams(client: BaseClient, getInternals: ClientInternalsGetter, options?: AuthModeParams): AuthModeParams;
/**
 * Retrieves custom headers from either the client or request options.
 * @param client V6Client | V6ClientSSRRequest | V6ClientSSRCookies - for extracting client headers
 * @param requestHeaders {@link CustomHeaders} - request headers
 * @returns custom headers as {@link CustomHeaders}
 */
export declare function getCustomHeaders(client: BaseClient, getInternals: ClientInternalsGetter, requestHeaders?: CustomHeaders): CustomHeaders;
