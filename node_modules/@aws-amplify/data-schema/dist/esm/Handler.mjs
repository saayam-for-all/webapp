import { brand } from './util/Brand.mjs';

const dataSymbol = Symbol('Data');
function buildHandler(brandName) {
    return brand(brandName);
}
function getHandlerData(handler) {
    return handler[dataSymbol];
}
//#region handler.inlineSql
const inlineSqlBrand = 'inlineSql';
function inlineSql(sql) {
    return { [dataSymbol]: sql, ...buildHandler(inlineSqlBrand) };
}
//#endregion
//#region handler.sqlReference
const sqlReferenceBrand = 'sqlReference';
function sqlReference(sqlFilePath) {
    // used to determine caller directory in order to resolve relative path downstream
    const stack = new Error().stack;
    return {
        [dataSymbol]: { stack, entry: sqlFilePath },
        ...buildHandler(sqlReferenceBrand),
    };
}
const customHandlerBrand = 'customHandler';
/**
 * Use a custom JavaScript resolver to handle a query, mutation, or subscription.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/#step-2---configure-custom-business-logic-handler-code}
 * @param customHandler `{ entry: "path-to-javascript-resolver-file.js", dataSource: "Data Source name added via "backend.data.add*DataSoruce(...)"}`
 * @returns A JavaScript resolver attached to the query, mutation, or subscription.
 * @example
 * const schema = a.schema({
 *   Post: a.model({
 *     content: a.string(),
 *     likes: a.integer()
 *       .authorization(allow => [allow.authenticated().to(['read'])])
 *   }).authorization(allow => [
 *     allow.owner(),
 *     allow.authenticated().to(['read'])
 *   ]),
 *
 *   likePost: a
 *     .mutation()
 *     .arguments({ postId: a.id() })
 *     .returns(a.ref('Post'))
 *     .authorization(allow => [allow.authenticated()])
 *     .handler(a.handler.custom({
 *       dataSource: a.ref('Post'),
 *       entry: './increment-like.js'
 *     }))
 * });
 */
function custom(customHandler) {
    // used to determine caller directory in order to resolve relative path downstream
    const stack = new Error().stack;
    return {
        [dataSymbol]: { ...customHandler, stack },
        ...buildHandler(customHandlerBrand),
    };
}
const functionHandlerBrand = 'functionHandler';
const asyncFunctionHandlerBrand = 'asyncFunctionHandler';
/**
 * Use a function created via `defineFunction` to handle the custom query/mutation/subscription. In your function handler,
 * you can use the `Schema["YOUR_QUERY_OR_MUTATION_NAME"]["functionHandler"]` utility type to type the handler function.
 * @example
 * import {
 *   type ClientSchema,
 *   a,
 *   defineData,
 *   defineFunction // 1.Import "defineFunction" to create new functions
 * } from '@aws-amplify/backend';
 *
 * // 2. define a function
 * const echoHandler = defineFunction({
 *   entry: './echo-handler/handler.ts'
 * })
 *
 * const schema = a.schema({
 *   EchoResponse: a.customType({
 *     content: a.string(),
 *     executionDuration: a.float()
 *   }),
 *
 *   echo: a
 *     .query()
 *     .arguments({ content: a.string() })
 *     .returns(a.ref('EchoResponse'))
 *     .authorization(allow => [allow.publicApiKey()])
 *     // 3. set the function has the handler
 *     .handler(a.handler.function(echoHandler))
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @param fn A function created via `defineFunction`. Alternatively, you can pass in a "string" of the function name and pass
 * in a corresponding value into the `functionMap` property of defineData.
 * @returns A handler for the query / mutation / subscription
 */
function fcn(fn) {
    return {
        [dataSymbol]: {
            handler: fn,
            invocationType: 'RequestResponse',
        },
        async() {
            return _async(this);
        },
        ...buildHandler(functionHandlerBrand),
    };
}
function _async(fnHandler) {
    return {
        [dataSymbol]: {
            handler: fnHandler[dataSymbol].handler,
            invocationType: 'Event',
        },
        ...buildHandler(asyncFunctionHandlerBrand),
    };
}
//#endregion
const handler = {
    inlineSql,
    sqlReference,
    custom,
    function: fcn,
};

export { getHandlerData, handler };
//# sourceMappingURL=Handler.mjs.map
