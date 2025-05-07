import { AuthModeParams, AmplifyServer, BaseClient, ClientInternalsGetter, CustomOperation, ListArgs, QueryArgs, ModelIntrospectionSchema, CustomUserAgentDetails } from '../../bridge-types';
type CustomOperationOptions = AuthModeParams & ListArgs;
type OpArgs = [AmplifyServer.ContextSpec, QueryArgs, CustomOperationOptions] | [AmplifyServer.ContextSpec, CustomOperationOptions] | [QueryArgs, CustomOperationOptions] | [CustomOperationOptions];
/**
 * Builds an operation function, embedded with all client and context data, that
 * can be attached to a client as a custom query or mutation.
 *
 * If we have this source schema:
 *
 * ```typescript
 * a.schema({
 *   echo: a.query()
 *     .arguments({input: a.string().required()})
 *     .returns(a.string())
 * })
 * ```
 *
 * Our model intro schema will contain an entry like this:
 *
 * ```ts
 * {
 *   queries: {
 *     echo: {
 *       name: "echo",
 *       isArray: false,
 *       type: 'String',
 *       isRequired: false,
 *       arguments: {
 *         input: {
 *           name: 'input',
 *           isArray: false,
 *           type: String,
 *           isRequired: true
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * The `echo` object is used to build the `echo' method that goes here:
 *
 * ```typescript
 * const client = generateClent()
 * const { data } = await client.queries.echo({input: 'a string'});
 * //                                    ^
 * //                                    |
 * //                                    +-- This one right here.
 * //
 * ```
 *
 *
 * @param client The client to run graphql queries through.
 * @param modelIntrospection The model introspection schema the op comes from.
 * @param operationType The broad category of graphql operation.
 * @param operation The operation definition from the introspection schema.
 * @param useContext Whether the function needs to accept an SSR context.
 * @returns The operation function to attach to query, mutations, etc.
 */
export declare function customOpFactory(client: BaseClient, modelIntrospection: ModelIntrospectionSchema, operationType: 'query' | 'mutation' | 'subscription', operation: CustomOperation, useContext: boolean, getInternals: ClientInternalsGetter, customUserAgentDetails?: CustomUserAgentDetails): (...args: OpArgs) => import("rxjs").Observable<any> | Promise<unknown>;
export {};
