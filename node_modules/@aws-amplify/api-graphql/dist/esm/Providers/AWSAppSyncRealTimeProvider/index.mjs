import { USER_AGENT_HEADER, getAmplifyUserAgent } from '@aws-amplify/core/internals/utils';
import { MESSAGE_TYPES, DEFAULT_KEEP_ALIVE_TIMEOUT } from '../constants.mjs';
import { AWSWebSocketProvider } from '../AWSWebSocketProvider/index.mjs';
import { awsRealTimeHeaderBasedAuth } from '../AWSWebSocketProvider/authHeaders.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const PROVIDER_NAME = 'AWSAppSyncRealTimeProvider';
const WS_PROTOCOL_NAME = 'graphql-ws';
const CONNECT_URI = '/connect';
class AWSAppSyncRealTimeProvider extends AWSWebSocketProvider {
    constructor() {
        super({
            providerName: PROVIDER_NAME,
            wsProtocolName: WS_PROTOCOL_NAME,
            connectUri: CONNECT_URI,
        });
    }
    getProviderName() {
        return PROVIDER_NAME;
    }
    subscribe(options, customUserAgentDetails) {
        return super.subscribe(options, customUserAgentDetails);
    }
    async _prepareSubscriptionPayload({ options, subscriptionId, customUserAgentDetails, additionalCustomHeaders, libraryConfigHeaders, }) {
        const { appSyncGraphqlEndpoint, authenticationType, query, variables, apiKey, region, } = options;
        const data = {
            query,
            variables,
        };
        const serializedData = JSON.stringify(data);
        const headers = {
            ...(await awsRealTimeHeaderBasedAuth({
                apiKey,
                appSyncGraphqlEndpoint,
                authenticationType,
                payload: serializedData,
                canonicalUri: '',
                region,
                additionalCustomHeaders,
            })),
            ...libraryConfigHeaders,
            ...additionalCustomHeaders,
            [USER_AGENT_HEADER]: getAmplifyUserAgent(customUserAgentDetails),
        };
        const subscriptionMessage = {
            id: subscriptionId,
            payload: {
                data: serializedData,
                extensions: {
                    authorization: {
                        ...headers,
                    },
                },
            },
            type: MESSAGE_TYPES.GQL_START,
        };
        const serializedSubscriptionMessage = JSON.stringify(subscriptionMessage);
        return serializedSubscriptionMessage;
    }
    _handleSubscriptionData(message) {
        this.logger.debug(`subscription message from AWS AppSync RealTime: ${message.data}`);
        const { id = '', payload, type } = JSON.parse(String(message.data));
        const { observer = null, query = '', variables = {}, } = this.subscriptionObserverMap.get(id) || {};
        this.logger.debug({ id, observer, query, variables });
        if (type === MESSAGE_TYPES.DATA && payload && payload.data) {
            if (observer) {
                observer.next(payload);
            }
            else {
                this.logger.debug(`observer not found for id: ${id}`);
            }
            return [true, { id, type, payload }];
        }
        return [false, { id, type, payload }];
    }
    _unsubscribeMessage(subscriptionId) {
        return {
            id: subscriptionId,
            type: MESSAGE_TYPES.GQL_STOP,
        };
    }
    _extractConnectionTimeout(data) {
        const { payload: { connectionTimeoutMs = DEFAULT_KEEP_ALIVE_TIMEOUT } = {}, } = data;
        return connectionTimeoutMs;
    }
    _extractErrorCodeAndType(data) {
        const { payload: { errors: [{ errorType = '', errorCode = 0 } = {}] = [] } = {}, } = data;
        return { errorCode, errorType };
    }
}

export { AWSAppSyncRealTimeProvider };
//# sourceMappingURL=index.mjs.map
