'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIamAuthApplicableForRest = exports.isIamAuthApplicableForGraphQL = void 0;
/**
 * Determines if IAM authentication should be applied for a GraphQL request.
 *
 * This function checks the `headers` of the HTTP request to determine if IAM authentication
 * is applicable. IAM authentication is considered applicable if there is no `authorization`
 * header, no `x-api-key` header, and `signingServiceInfo` is provided.
 *
 * @param request - The HTTP request object containing headers.
 * @param signingServiceInfo - Optional signing service information,
 * including service and region.
 * @returns A boolean `true` if IAM authentication should be applied.
 *
 * @internal
 */
const isIamAuthApplicableForGraphQL = ({ headers }, signingServiceInfo) => !headers.authorization && !headers['x-api-key'] && !!signingServiceInfo;
exports.isIamAuthApplicableForGraphQL = isIamAuthApplicableForGraphQL;
/**
 * Determines if IAM authentication should be applied for a REST request.
 *
 * This function checks the `headers` of the HTTP request to determine if IAM authentication
 * is applicable. IAM authentication is considered applicable if there is no `authorization`
 * header and `signingServiceInfo` is provided.
 *
 * @param request - The HTTP request object containing headers.
 * @param signingServiceInfo - Optional signing service information,
 * including service and region.
 * @returns A boolean `true` if IAM authentication should be applied.
 *
 * @internal
 */
const isIamAuthApplicableForRest = ({ headers }, signingServiceInfo) => !headers.authorization && !!signingServiceInfo;
exports.isIamAuthApplicableForRest = isIamAuthApplicableForRest;
//# sourceMappingURL=isIamAuthApplicable.js.map
