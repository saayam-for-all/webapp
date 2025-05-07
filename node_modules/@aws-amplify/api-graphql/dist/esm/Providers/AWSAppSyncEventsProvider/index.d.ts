import { CustomUserAgentDetails, DocumentType, GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { CustomHeaders } from '@aws-amplify/data-schema/runtime';
import { AWSWebSocketProvider } from '../AWSWebSocketProvider';
type ResolvedGraphQLAuthModes = Exclude<GraphQLAuthMode, 'identityPool'>;
interface AWSAppSyncEventProviderOptions {
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
interface DataResponse {
    id: string;
    payload: string;
    type: string;
}
export declare class AWSAppSyncEventProvider extends AWSWebSocketProvider {
    constructor();
    getProviderName(): string;
    connect(options: AWSAppSyncEventProviderOptions): Promise<void>;
    subscribe(options?: AWSAppSyncEventProviderOptions, customUserAgentDetails?: CustomUserAgentDetails): import("rxjs").Observable<Record<string, unknown>>;
    publish(options: AWSAppSyncEventProviderOptions, customUserAgentDetails?: CustomUserAgentDetails): Promise<void>;
    closeIfNoActiveSubscription(): void;
    protected _prepareSubscriptionPayload({ options, subscriptionId, customUserAgentDetails, additionalCustomHeaders, libraryConfigHeaders, publish, }: {
        options: AWSAppSyncEventProviderOptions;
        subscriptionId: string;
        customUserAgentDetails: CustomUserAgentDetails | undefined;
        additionalCustomHeaders: Record<string, string>;
        libraryConfigHeaders: Record<string, string>;
        publish?: boolean;
    }): Promise<string>;
    protected _handleSubscriptionData(message: MessageEvent): [boolean, DataResponse];
    protected _unsubscribeMessage(subscriptionId: string): {
        id: string;
        type: string;
    };
    protected _extractConnectionTimeout(data: Record<string, any>): number;
    protected _extractErrorCodeAndType(data: Record<string, any>): {
        errorCode: number;
        errorType: string;
    };
}
export declare const AppSyncEventProvider: AWSAppSyncEventProvider;
export {};
