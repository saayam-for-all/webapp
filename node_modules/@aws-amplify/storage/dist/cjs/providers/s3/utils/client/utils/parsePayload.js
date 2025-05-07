'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXmlBody = exports.createXmlErrorParser = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const runtime_1 = require("../runtime");
/**
 * Factory creating a parser that parses the JS Error object from the XML
 * response payload.
 *
 * @param input Input object
 * @param input.noErrorWrapping Whether the error code and message are located
 *   directly in the root XML element, or in a nested `<Error>` element.
 *   See: https://smithy.io/2.0/aws/protocols/aws-restxml-protocol.html#restxml-errors
 *
 *   Default to false.
 *
 * @internal
 */
const createXmlErrorParser = ({ noErrorWrapping = false, } = {}) => async (response) => {
    if (!response || response.statusCode < 300) {
        return;
    }
    const { statusCode } = response;
    const body = await (0, exports.parseXmlBody)(response);
    const errorLocation = noErrorWrapping ? body : body.Error;
    const code = errorLocation?.Code
        ? errorLocation.Code
        : statusCode === 404
            ? 'NotFound'
            : statusCode.toString();
    const message = errorLocation?.message ?? errorLocation?.Message ?? code;
    const error = new Error(message);
    return Object.assign(error, {
        name: code,
        $metadata: (0, aws_client_utils_1.parseMetadata)(response),
    });
};
exports.createXmlErrorParser = createXmlErrorParser;
const parseXmlBody = async (response) => {
    if (!response.body) {
        // S3 can return 200 without a body indicating failure.
        throw new Error('S3 aborted request.');
    }
    const data = await response.body.text();
    if (data?.length > 0) {
        try {
            return runtime_1.parser.parse(data);
        }
        catch (error) {
            throw new Error(`Failed to parse XML response: ${error}`);
        }
    }
    return {};
};
exports.parseXmlBody = parseXmlBody;
//# sourceMappingURL=parsePayload.js.map
