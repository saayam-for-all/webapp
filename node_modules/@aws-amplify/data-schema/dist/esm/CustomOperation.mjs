import { brand, brandSymbol } from './util/Brand.mjs';
import { allowForCustomOperations } from './Authorization.mjs';

const queryBrand = 'queryCustomOperation';
const mutationBrand = 'mutationCustomOperation';
const subscriptionBrand = 'subscriptionCustomOperation';
const generationBrand = 'generationCustomOperation';
const CustomOperationNames = [
    'Query',
    'Mutation',
    'Subscription',
    'Generation',
];
function brandedBuilder(builder, brandValue) {
    return { ...builder, ...brand(brandValue) };
}
function _custom(typeName, brand, input) {
    const data = {
        arguments: {},
        returnType: null,
        authorization: [],
        typeName: typeName,
        handlers: null,
        subscriptionSource: [],
        input,
    };
    const builder = brandedBuilder({
        arguments(args) {
            data.arguments = args;
            return this;
        },
        returns(returnType) {
            data.returnType = returnType;
            return this;
        },
        authorization(callback) {
            const rules = callback(allowForCustomOperations);
            data.authorization = Array.isArray(rules) ? rules : [rules];
            return this;
        },
        handler(handlers) {
            data.handlers = Array.isArray(handlers)
                ? handlers
                : [handlers];
            if (lastHandlerIsAsyncFunction(handlers)) {
                data.returnType = eventInvocationResponse;
            }
            return this;
        },
        for(source) {
            data.subscriptionSource = Array.isArray(source) ? source : [source];
            return this;
        },
    }, brand);
    return { ...builder, data };
}
/**
 * Use a custom query to define an API request that will retrieve backend data.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @example
 * const schema = a.schema({
 *   echo: a
 *     .query()
 *     .arguments({ content: a.string() })
 *     .returns(a.ref('EchoResponse'))
 *     .authorization(allow => [allow.publicApiKey()])
 *     // 3. set the function has the handler
 *     .handler(a.handler.function(echoHandler)),
 *
 *   EchoResponse: a.customType({
 *     content: a.string(),
 *     executionDuration: a.float()
 *   }),
 * });
 * @returns a custom query
 */
function query() {
    return _custom('Query', queryBrand);
}
/**
 * Use a custom mutation to define an API request that will modify backend data or trigger a subscription event.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @example
 * likePost: a
 *   .mutation()
 *   .arguments({ postId: a.string() })
 *   .returns(a.ref('Post'))
 *   .authorization(allow => [allow.publicApiKey()])
 *   .handler(a.handler.function(echoHandler))
 * @returns a custom mutation
 */
function mutation() {
    return _custom('Mutation', mutationBrand);
}
/**
 * Define a custom subscription to receive an event when a mutation is triggered
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/}
 * @example
 * // Subscribe to incoming messages
 * receive: a.subscription()
 *   // subscribes to the 'publish' mutation
 *   .for(a.ref('publish'))
 *   // subscription handler to set custom filters
 *   .handler(a.handler.custom({entry: './receive.js'}))
 *   // authorization rules as to who can subscribe to the data
 *   .authorization(allow => [allow.publicApiKey()]),
 * @returns a custom subscription
 */
function subscription() {
    return _custom('Subscription', subscriptionBrand);
}
const eventInvocationResponse = {
    data: {
        type: 'ref',
        link: 'EventInvocationResponse',
        valueRequired: false,
        array: false,
        arrayRequired: false,
        mutationOperations: [],
        authorization: [],
    },
};
function lastHandlerIsAsyncFunction(handlers) {
    const lastHandlerBrandSymbol = Array.isArray(handlers)
        ? handlers[handlers.length - 1][brandSymbol]
        : handlers[brandSymbol];
    return lastHandlerBrandSymbol === 'asyncFunctionHandler';
}
/**
 * Define an AI generation route for single request-response interaction with specified AI model.
 * @example
 * makeRecipe: a.generation({
 *   aiModel: { resourcePath },
 *   systemPrompt: 'Please make a recipe from the provided ingredients',
 * })
 *   .arguments({ ingredients: a.string().array() })
 *   .returns(a.ref("Recipe"))
 * @returns a generation route definition
 */
function generation(input) {
    return _custom('Generation', generationBrand, input);
}

export { CustomOperationNames, generation, mutation, query, subscription };
//# sourceMappingURL=CustomOperation.mjs.map
