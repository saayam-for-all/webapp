import { Observable } from 'rxjs';
import { ConsoleLogger } from '@aws-amplify/core';
import { CustomUserAgentDetails, DocumentType } from '@aws-amplify/core/internals/utils';
import { PubSubContentObserver } from '../../types/PubSub';
import { SUBSCRIPTION_STATUS } from '../constants';
import type { AWSAppSyncRealTimeProviderOptions } from '../AWSAppSyncRealTimeProvider';
export interface ObserverQuery {
    observer: PubSubContentObserver;
    query: string;
    variables: DocumentType;
    subscriptionState: SUBSCRIPTION_STATUS;
    subscriptionReadyCallback?(): void;
    subscriptionFailedCallback?(reason?: any): void;
    startAckTimeoutId?: ReturnType<typeof setTimeout>;
}
interface AWSWebSocketProviderArgs {
    providerName: string;
    wsProtocolName: string;
    connectUri: string;
}
export declare abstract class AWSWebSocketProvider {
    protected logger: ConsoleLogger;
    protected subscriptionObserverMap: Map<string, ObserverQuery>;
    protected allowNoSubscriptions: boolean;
    protected awsRealTimeSocket?: WebSocket;
    private socketStatus;
    private keepAliveTimestamp;
    private keepAliveHeartbeatIntervalId?;
    private promiseArray;
    private connectionState;
    private readonly connectionStateMonitor;
    private readonly reconnectionMonitor;
    private connectionStateMonitorSubscription;
    private readonly wsProtocolName;
    private readonly wsConnectUri;
    constructor(args: AWSWebSocketProviderArgs);
    /**
     * Mark the socket closed and release all active listeners
     */
    close(): Promise<void>;
    subscribe(options?: AWSAppSyncRealTimeProviderOptions, customUserAgentDetails?: CustomUserAgentDetails): Observable<Record<string, unknown>>;
    protected connect(options: AWSAppSyncRealTimeProviderOptions): Promise<void>;
    protected publish(options: AWSAppSyncRealTimeProviderOptions, customUserAgentDetails?: CustomUserAgentDetails): Promise<void>;
    private _connectWebSocket;
    private _publishMessage;
    private _cleanupSubscription;
    private _startConnectionStateMonitoring;
    protected abstract _prepareSubscriptionPayload(param: {
        options: AWSAppSyncRealTimeProviderOptions;
        subscriptionId: string;
        customUserAgentDetails: CustomUserAgentDetails | undefined;
        additionalCustomHeaders: Record<string, string>;
        libraryConfigHeaders: Record<string, string>;
        publish?: boolean;
    }): Promise<string>;
    private _startSubscriptionWithAWSAppSyncRealTime;
    private _logStartSubscriptionError;
    private _waitForSubscriptionToBeConnected;
    protected abstract _unsubscribeMessage(subscriptionId: string): {
        id: string;
        type: string;
    };
    private _sendUnsubscriptionMessage;
    private _removeSubscriptionObserver;
    protected _closeSocketIfRequired(): void;
    protected abstract _handleSubscriptionData(message: MessageEvent): [
        boolean,
        {
            id: string;
            payload: string | Record<string, unknown>;
            type: string;
        }
    ];
    protected abstract _extractConnectionTimeout(data: Record<string, any>): number;
    protected abstract _extractErrorCodeAndType(data: Record<string, any>): {
        errorCode: number;
        errorType: string;
    };
    private maintainKeepAlive;
    private keepAliveHeartbeat;
    private _handleIncomingSubscriptionMessage;
    private _errorDisconnect;
    private _closeSocket;
    private _timeoutStartSubscriptionAck;
    private _initializeWebSocketConnection;
    private _establishRetryableConnection;
    private _openConnection;
    private _getNewWebSocket;
    private _initiateHandshake;
    private _registerWebsocketHandlers;
    /**
     * Open WebSocket connection & perform handshake
     * Ref: https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html#appsynclong-real-time-websocket-client-implementation-guide-for-graphql-subscriptions
     *
     * @param subprotocol -
     */
    private _establishConnection;
}
export {};
