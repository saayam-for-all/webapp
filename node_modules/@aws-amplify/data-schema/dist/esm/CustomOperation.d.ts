import { AiModel, SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './util';
import { InternalField, ModelField, type BaseModelField } from './ModelField';
import { AllowModifierForCustomOperation, Authorization } from './Authorization';
import { RefType, InternalRef } from './RefType';
import { EnumType } from './EnumType';
import { CustomType } from './CustomType';
import type { AsyncFunctionHandler, CustomHandler, FunctionHandler, HandlerType as Handler } from './Handler';
import { InferenceConfiguration } from './ai/ModelType';
declare const queryBrand = "queryCustomOperation";
declare const mutationBrand = "mutationCustomOperation";
declare const subscriptionBrand = "subscriptionCustomOperation";
declare const generationBrand = "generationCustomOperation";
type CustomOperationBrand = typeof queryBrand | typeof mutationBrand | typeof subscriptionBrand | typeof generationBrand;
type CustomArguments = Record<string, BaseModelField | EnumType | CustomType<any> | RefType<any, any>>;
type SubscriptionSource = RefType<any, any>;
type InternalSubscriptionSource = InternalRef;
type CustomReturnType = RefType<any> | CustomType<any>;
type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;
type HandlerInputType = FunctionHandler[] | CustomHandler[] | AsyncFunctionHandler[] | HeterogeneousFunctionHandlerWithLastAsync | HeterogeneousFunctionHandlerType | Handler;
type HeterogeneousFunctionHandlerType = (FunctionHandler | AsyncFunctionHandler)[];
type HeterogeneousFunctionHandlerWithLastAsync = [
    ...HeterogeneousFunctionHandlerType,
    AsyncFunctionHandler
];
export type UltimateFunctionHandlerAsyncType = AsyncFunctionHandler | AsyncFunctionHandler[] | HeterogeneousFunctionHandlerWithLastAsync;
export declare const CustomOperationNames: readonly ["Query", "Mutation", "Subscription", "Generation"];
type CustomOperationName = (typeof CustomOperationNames)[number];
type CustomData = {
    arguments: CustomArguments;
    returnType: CustomReturnType | null;
    authorization: Authorization<any, any, any>[];
    typeName: CustomOperationName;
    handlers: Handler[] | null;
    subscriptionSource: SubscriptionSource[];
    input?: CustomOperationInput;
};
type InternalCustomData = CustomData & {
    arguments: InternalCustomArguments;
    returnType: InternalCustomReturnType;
    subscriptionSource: InternalSubscriptionSource[];
    authorization: Authorization<any, any, any>[];
};
export type CustomOperationInput = GenerationInput;
export type CustomOperationParamShape = {
    arguments: CustomArguments | null;
    returnType: CustomReturnType | null;
    authorization: Authorization<any, any, any>[];
    typeName: CustomOperationName;
    handlers: Handler | null;
    input?: CustomOperationInput;
};
/**
 * Custom operation definition interface
 *
 * @param T - The shape of the custom operation
 * @param K - The keys already defined
 * @param B - The brand of the custom operation
 */
export type CustomOperation<T extends CustomOperationParamShape, K extends keyof CustomOperation<T> = never, B extends CustomOperationBrand = CustomOperationBrand> = Omit<{
    arguments<Arguments extends CustomArguments>(args: Arguments): CustomOperation<SetTypeSubArg<T, 'arguments', Arguments>, K | 'arguments', B>;
    returns<ReturnType extends CustomReturnType>(returnType: ReturnType): CustomOperation<SetTypeSubArg<T, 'returnType', ReturnType>, K | 'returns', B>;
    authorization<AuthRuleType extends Authorization<any, any, any>>(callback: (allow: AllowModifierForCustomOperation) => AuthRuleType | AuthRuleType[]): CustomOperation<SetTypeSubArg<T, 'authorization', AuthRuleType[]>, K | 'authorization', B>;
    handler<H extends HandlerInputType>(handlers: H): [H] extends [UltimateFunctionHandlerAsyncType] ? CustomOperation<AsyncFunctionCustomOperation<T>, K | 'handler' | 'returns', B> : CustomOperation<T, K | 'handler', B>;
    for<Source extends SubscriptionSource>(source: Source | Source[]): CustomOperation<T['typeName'] extends 'Subscription' ? SetTypeSubArg<T, 'returnType', Source extends SubscriptionSource[] ? Source[number] : Source> : T, K | 'for', B>;
}, K> & Brand<B>;
/**
 * Internal representation of Custom Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustom<B extends CustomOperationBrand = any> = CustomOperation<any, never, B> & {
    data: InternalCustomData;
};
export type QueryCustomOperation = CustomOperation<CustomOperationParamShape, any, typeof queryBrand>;
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
export declare function query(): CustomOperation<{
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Query';
    handlers: null;
}, 'for', typeof queryBrand>;
export type MutationCustomOperation = CustomOperation<CustomOperationParamShape, any, typeof mutationBrand>;
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
export declare function mutation(): CustomOperation<{
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Mutation';
    handlers: null;
}, 'for', typeof mutationBrand>;
export type SubscriptionCustomOperation = CustomOperation<CustomOperationParamShape, any, typeof subscriptionBrand>;
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
export declare function subscription(): CustomOperation<{
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
}, 'returns', typeof subscriptionBrand>;
type AsyncFunctionCustomOperation<T extends CustomOperationParamShape> = SetTypeSubArg<SetTypeSubArg<T, 'returnType', EventInvocationResponseCustomType>, 'handlers', AsyncFunctionHandler>;
type EventInvocationResponseCustomType = CustomType<{
    fields: {
        success: ModelField<boolean, 'required', undefined>;
    };
}>;
export interface GenerationInput {
    aiModel: AiModel;
    systemPrompt: string;
    inferenceConfiguration?: InferenceConfiguration;
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
export declare function generation(input: GenerationInput): CustomOperation<{
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Generation';
    handlers: null;
    input: GenerationInput;
}, 'for' | 'handler', typeof generationBrand>;
export {};
