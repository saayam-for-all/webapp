import { CustomUserAgentDetails, DocumentType, GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { CustomHeaders } from '@aws-amplify/data-schema/runtime';
import { AWSWebSocketProvider } from '../AWSWebSocketProvider';
type ResolvedGraphQLAuthModes = Exclude<GraphQLAuthMode, 'identityPool'>;
export interface AWSAppSyncRealTimeProviderOptions {
    appSyncGraphqlEndpoint?: string;
    authenticationType?: ResolvedGraphQLAuthModes;
    query?: string;
    variables?: DocumentType;
    apiKey?: string;
    region?: string;
    libraryConfigHeaders?(): Promise<Record<string, unknown> | Headers>;
    additionalHeaders?: CustomHeaders;
    additionalCustomHeaders?: Record<string, string>;
    authToken?: string;
}
interface DataObject extends Record<string, unknown> {
    data: Record<string, unknown>;
}
interface DataPayload {
    id: string;
    payload: DataObject;
    type: string;
}
export declare class AWSAppSyncRealTimeProvider extends AWSWebSocketProvider {
    constructor();
    getProviderName(): string;
    subscribe(options?: AWSAppSyncRealTimeProviderOptions, customUserAgentDetails?: CustomUserAgentDetails): import("rxjs").Observable<Record<string, unknown>>;
    protected _prepareSubscriptionPayload({ options, subscriptionId, customUserAgentDetails, additionalCustomHeaders, libraryConfigHeaders, }: {
        options: AWSAppSyncRealTimeProviderOptions;
        subscriptionId: string;
        customUserAgentDetails: CustomUserAgentDetails | undefined;
        additionalCustomHeaders: Record<string, string>;
        libraryConfigHeaders: Record<string, string>;
    }): Promise<string>;
    protected _handleSubscriptionData(message: MessageEvent): [boolean, DataPayload];
    protected _unsubscribeMessage(subscriptionId: string): {
        id: string;
        type: string;
    };
    protected _extractConnectionTimeout(data: Record<string, any>): number;
    protected _extractErrorCodeAndType(data: any): {
        errorCode: number;
        errorType: string;
    };
}
export {};
