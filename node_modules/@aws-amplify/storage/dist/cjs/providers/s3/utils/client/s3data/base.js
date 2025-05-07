'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.retryDecider = exports.parseXmlError = exports.isDnsCompatibleBucketName = exports.SERVICE_NAME = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_2 = require("../utils");
const constants_1 = require("../../constants");
const assertValidationError_1 = require("../../../../../errors/utils/assertValidationError");
const validation_1 = require("../../../../../errors/types/validation");
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
/**
 * The service name used to sign requests if the API requires authentication.
 */
exports.SERVICE_NAME = 's3';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region, and input parameters.
 */
const endpointResolver = (options, apiInput) => {
    const { region, useAccelerateEndpoint, customEndpoint, forcePathStyle } = options;
    let endpoint;
    // 1. get base endpoint
    if (customEndpoint) {
        if (customEndpoint === constants_1.LOCAL_TESTING_S3_ENDPOINT) {
            endpoint = new utils_1.AmplifyUrl(customEndpoint);
        }
        (0, assertValidationError_1.assertValidationError)(!customEndpoint.includes('://'), validation_1.StorageValidationErrorCode.InvalidCustomEndpoint);
        endpoint = new utils_1.AmplifyUrl(`https://${customEndpoint}`);
    }
    else if (useAccelerateEndpoint) {
        // this ErrorCode isn't expose yet since forcePathStyle param isn't publicly exposed
        (0, assertValidationError_1.assertValidationError)(!forcePathStyle, validation_1.StorageValidationErrorCode.ForcePathStyleEndpointNotSupported);
        endpoint = new utils_1.AmplifyUrl(`https://s3-accelerate.${(0, aws_client_utils_1.getDnsSuffix)(region)}`);
    }
    else {
        endpoint = new utils_1.AmplifyUrl(`https://s3.${region}.${(0, aws_client_utils_1.getDnsSuffix)(region)}`);
    }
    // 2. inject bucket name
    if (apiInput?.Bucket) {
        (0, assertValidationError_1.assertValidationError)((0, exports.isDnsCompatibleBucketName)(apiInput.Bucket), validation_1.StorageValidationErrorCode.DnsIncompatibleBucketName);
        if (forcePathStyle || apiInput.Bucket.includes('.')) {
            endpoint.pathname = `/${apiInput.Bucket}`;
        }
        else {
            endpoint.host = `${apiInput.Bucket}.${endpoint.host}`;
        }
    }
    return { url: endpoint };
};
/**
 * Determines whether a given string is DNS compliant per the rules outlined by
 * S3. Length, capitaization, and leading dot restrictions are enforced by the
 * DOMAIN_PATTERN regular expression.
 * @internal
 *
 * @see https://github.com/aws/aws-sdk-js-v3/blob/f2da6182298d4d6b02e84fb723492c07c27469a8/packages/middleware-bucket-endpoint/src/bucketHostnameUtils.ts#L39-L48
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
 */
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) &&
    !IP_ADDRESS_PATTERN.test(bucketName) &&
    !DOTS_PATTERN.test(bucketName);
exports.isDnsCompatibleBucketName = isDnsCompatibleBucketName;
/**
 * Error parser for the XML payload of S3 data plane error response. The error's
 * `Code` and `Message` locates directly at the XML root element.
 *
 * @example
 * ```
 * <?xml version="1.0" encoding="UTF-8"?>
 * 	<Error>
 * 		<Code>NoSuchKey</Code>
 * 		<Message>The resource you requested does not exist</Message>
 * 		<Resource>/mybucket/myfoto.jpg</Resource>
 * 		<RequestId>4442587FB7D0A2F9</RequestId>
 * 	</Error>
 * 	```
 *
 * @internal
 */
exports.parseXmlError = (0, utils_2.createXmlErrorParser)({ noErrorWrapping: true });
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
    useAccelerateEndpoint: false,
    uriEscapePath: false, // Required by S3. See https://github.com/aws/aws-sdk-js-v3/blob/9ba012dfa3a3429aa2db0f90b3b0b3a7a31f9bc3/packages/signature-v4/src/SignatureV4.ts#L76-L83
};
//# sourceMappingURL=base.js.map
