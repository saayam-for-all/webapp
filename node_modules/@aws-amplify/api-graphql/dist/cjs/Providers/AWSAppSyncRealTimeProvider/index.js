'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSAppSyncRealTimeProvider = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const constants_1 = require("../constants");
const AWSWebSocketProvider_1 = require("../AWSWebSocketProvider");
const authHeaders_1 = require("../AWSWebSocketProvider/authHeaders");
const PROVIDER_NAME = 'AWSAppSyncRealTimeProvider';
const WS_PROTOCOL_NAME = 'graphql-ws';
const CONNECT_URI = '/connect';
class AWSAppSyncRealTimeProvider extends AWSWebSocketProvider_1.AWSWebSocketProvider {
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
            ...(await (0, authHeaders_1.awsRealTimeHeaderBasedAuth)({
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
            [utils_1.USER_AGENT_HEADER]: (0, utils_1.getAmplifyUserAgent)(customUserAgentDetails),
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
            type: constants_1.MESSAGE_TYPES.GQL_START,
        };
        const serializedSubscriptionMessage = JSON.stringify(subscriptionMessage);
        return serializedSubscriptionMessage;
    }
    _handleSubscriptionData(message) {
        this.logger.debug(`subscription message from AWS AppSync RealTime: ${message.data}`);
        const { id = '', payload, type } = JSON.parse(String(message.data));
        const { observer = null, query = '', variables = {}, } = this.subscriptionObserverMap.get(id) || {};
        this.logger.debug({ id, observer, query, variables });
        if (type === constants_1.MESSAGE_TYPES.DATA && payload && payload.data) {
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
            type: constants_1.MESSAGE_TYPES.GQL_STOP,
        };
    }
    _extractConnectionTimeout(data) {
        const { payload: { connectionTimeoutMs = constants_1.DEFAULT_KEEP_ALIVE_TIMEOUT } = {}, } = data;
        return connectionTimeoutMs;
    }
    _extractErrorCodeAndType(data) {
        const { payload: { errors: [{ errorType = '', errorCode = 0 } = {}] = [] } = {}, } = data;
        return { errorCode, errorType };
    }
}
exports.AWSAppSyncRealTimeProvider = AWSAppSyncRealTimeProvider;
//# sourceMappingURL=index.js.map
