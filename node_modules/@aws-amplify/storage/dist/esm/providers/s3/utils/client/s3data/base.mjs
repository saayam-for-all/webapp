import { getAmplifyUserAgent, AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { jitteredBackoff, getDnsSuffix } from '@aws-amplify/core/internals/aws-client-utils';
import { createXmlErrorParser } from '../utils/parsePayload.mjs';
import '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { createRetryDecider } from '../utils/createRetryDecider.mjs';
import { LOCAL_TESTING_S3_ENDPOINT } from '../../constants.mjs';
import { assertValidationError } from '../../../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../../../errors/types/validation.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
/**
 * The service name used to sign requests if the API requires authentication.
 */
const SERVICE_NAME = 's3';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region, and input parameters.
 */
const endpointResolver = (options, apiInput) => {
    const { region, useAccelerateEndpoint, customEndpoint, forcePathStyle } = options;
    let endpoint;
    // 1. get base endpoint
    if (customEndpoint) {
        if (customEndpoint === LOCAL_TESTING_S3_ENDPOINT) {
            endpoint = new AmplifyUrl(customEndpoint);
        }
        assertValidationError(!customEndpoint.includes('://'), StorageValidationErrorCode.InvalidCustomEndpoint);
        endpoint = new AmplifyUrl(`https://${customEndpoint}`);
    }
    else if (useAccelerateEndpoint) {
        // this ErrorCode isn't expose yet since forcePathStyle param isn't publicly exposed
        assertValidationError(!forcePathStyle, StorageValidationErrorCode.ForcePathStyleEndpointNotSupported);
        endpoint = new AmplifyUrl(`https://s3-accelerate.${getDnsSuffix(region)}`);
    }
    else {
        endpoint = new AmplifyUrl(`https://s3.${region}.${getDnsSuffix(region)}`);
    }
    // 2. inject bucket name
    if (apiInput?.Bucket) {
        assertValidationError(isDnsCompatibleBucketName(apiInput.Bucket), StorageValidationErrorCode.DnsIncompatibleBucketName);
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
const parseXmlError = createXmlErrorParser({ noErrorWrapping: true });
/**
 * @internal
 */
const retryDecider = createRetryDecider(parseXmlError);
/**
 * @internal
 */
const defaultConfig = {
    service: SERVICE_NAME,
    endpointResolver,
    retryDecider,
    computeDelay: jitteredBackoff,
    userAgentValue: getAmplifyUserAgent(),
    useAccelerateEndpoint: false,
    uriEscapePath: false, // Required by S3. See https://github.com/aws/aws-sdk-js-v3/blob/9ba012dfa3a3429aa2db0f90b3b0b3a7a31f9bc3/packages/signature-v4/src/SignatureV4.ts#L76-L83
};

export { SERVICE_NAME, defaultConfig, isDnsCompatibleBucketName, parseXmlError, retryDecider };
//# sourceMappingURL=base.mjs.map
