'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.retryDecider = exports.parseXmlError = exports.SERVICE_NAME = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_2 = require("../utils");
const assertValidationError_1 = require("../../../../../errors/utils/assertValidationError");
const validation_1 = require("../../../../../errors/types/validation");
/**
 * The service name used to sign requests if the API requires authentication.
 */
exports.SERVICE_NAME = 's3';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region, and input parameters.
 */
const endpointResolver = (options, apiInput) => {
    const { region, customEndpoint } = options;
    const { AccountId: accountId } = apiInput;
    let endpoint;
    if (customEndpoint) {
        (0, assertValidationError_1.assertValidationError)(!customEndpoint.includes('://'), validation_1.StorageValidationErrorCode.InvalidCustomEndpoint);
        endpoint = new utils_1.AmplifyUrl(`https://${accountId}.${customEndpoint}`);
    }
    else {
        endpoint = new utils_1.AmplifyUrl(`https://${accountId}.s3-control.${region}.${(0, aws_client_utils_1.getDnsSuffix)(region)}`);
    }
    return { url: endpoint };
};
/**
 * Error parser for the XML payload of S3 control plane error response. The
 * error's `Code` and `Message` locates at the nested `Error` element instead of
 * the XML root element.
 *
 * @example
 * ```
 * 	<?xml version="1.0" encoding="UTF-8"?>
 * 	<ErrorResponse>
 * 	  <Error>
 * 		  <Code>AccessDenied</Code>
 * 		  <Message>Access Denied</Message>
 * 		</Error>
 * 		<RequestId>656c76696e6727732072657175657374</RequestId>
 * 		<HostId>Uuag1LuByRx9e6j5Onimru9pO4ZVKnJ2Qz7/C1NPcfTWAtRPfTaOFg==</HostId>
 * 	</ErrorResponse>
 * 	```
 *
 * @internal
 */
exports.parseXmlError = (0, utils_2.createXmlErrorParser)();
/**
 * @internal
 */
exports.retryDecider = (0, utils_2.createRetryDecider)(exports.parseXmlError);
/**
 * @internal
 */
exports.defaultConfig = {
    service: exports.SERVICE_NAME,
    endpointResolver,
    retryDecider: exports.retryDecider,
    computeDelay: aws_client_utils_1.jitteredBackoff,
    userAgentValue: (0, utils_1.getAmplifyUserAgent)(),
    uriEscapePath: false, // Required by S3. See https://github.com/aws/aws-sdk-js-v3/blob/9ba012dfa3a3429aa2db0f90b3b0b3a7a31f9bc3/packages/signature-v4/src/SignatureV4.ts#L76-L83
};
//# sourceMappingURL=base.js.map
