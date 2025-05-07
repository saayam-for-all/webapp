'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTransferHandler = void 0;
const errors_1 = require("../../errors");
const memoization_1 = require("../utils/memoization");
const types_1 = require("../../types");
const shouldSendBody = (method) => !['HEAD', 'GET', 'DELETE'].includes(method.toUpperCase());
// TODO[AllanZhengYP]: we need to provide isCanceledError utility
const fetchTransferHandler = async ({ url, method, headers, body }, { abortSignal, cache, withCrossDomainCredentials }) => {
    let resp;
    try {
        resp = await fetch(url, {
            method,
            headers,
            body: shouldSendBody(method) ? body : undefined,
            signal: abortSignal,
            cache,
            credentials: withCrossDomainCredentials ? 'include' : 'same-origin',
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            throw new errors_1.AmplifyError({
                name: types_1.AmplifyErrorCode.NetworkError,
                message: 'A network error has occurred.',
                underlyingError: e,
            });
        }
        throw e;
    }
    const responseHeaders = {};
    resp.headers?.forEach((value, key) => {
        responseHeaders[key.toLowerCase()] = value;
    });
    const httpResponse = {
        statusCode: resp.status,
        headers: responseHeaders,
        body: null,
    };
    // resp.body is a ReadableStream according to Fetch API spec, but React Native
    // does not implement it.
    const bodyWithMixin = Object.assign(resp.body ?? {}, {
        text: (0, memoization_1.withMemoization)(() => resp.text()),
        blob: (0, memoization_1.withMemoization)(() => resp.blob()),
        json: (0, memoization_1.withMemoization)(() => resp.json()),
    });
    return {
        ...httpResponse,
        body: bodyWithMixin,
    };
};
exports.fetchTransferHandler = fetchTransferHandler;
//# sourceMappingURL=fetch.js.map
