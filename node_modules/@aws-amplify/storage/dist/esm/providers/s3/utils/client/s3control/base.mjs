import { getAmplifyUserAgent, AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { jitteredBackoff, getDnsSuffix } from '@aws-amplify/core/internals/aws-client-utils';
import { createXmlErrorParser } from '../utils/parsePayload.mjs';
import '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { createRetryDecider } from '../utils/createRetryDecider.mjs';
import { assertValidationError } from '../../../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../../../errors/types/validation.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * The service name used to sign requests if the API requires authentication.
 */
const SERVICE_NAME = 's3';
/**
 * The endpoint resolver function that returns the endpoint URL for a given region, and input parameters.
 */
const endpointResolver = (options, apiInput) => {
    const { region, customEndpoint } = options;
    const { AccountId: accountId } = apiInput;
    let endpoint;
    if (customEndpoint) {
        assertValidationError(!customEndpoint.includes('://'), StorageValidationErrorCode.InvalidCustomEndpoint);
        endpoint = new AmplifyUrl(`https://${accountId}.${customEndpoint}`);
    }
    else {
        endpoint = new AmplifyUrl(`https://${accountId}.s3-control.${region}.${getDnsSuffix(region)}`);
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
const parseXmlError = createXmlErrorParser();
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
    uriEscapePath: false, // Required by S3. See https://github.com/aws/aws-sdk-js-v3/blob/9ba012dfa3a3429aa2db0f90b3b0b3a7a31f9bc3/packages/signature-v4/src/SignatureV4.ts#L76-L83
};

export { SERVICE_NAME, defaultConfig, parseXmlError, retryDecider };
//# sourceMappingURL=base.mjs.map
