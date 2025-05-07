import { HttpRequest } from '@aws-amplify/core/internals/aws-client-utils';
import { SigningServiceInfo } from '../types';
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
export declare const isIamAuthApplicableForGraphQL: ({ headers }: HttpRequest, signingServiceInfo?: SigningServiceInfo) => boolean;
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
export declare const isIamAuthApplicableForRest: ({ headers }: HttpRequest, signingServiceInfo?: SigningServiceInfo) => boolean;
