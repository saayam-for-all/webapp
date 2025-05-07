import { ErrorParser, HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
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
export declare const createXmlErrorParser: ({ noErrorWrapping, }?: {
    noErrorWrapping?: boolean | undefined;
}) => ErrorParser;
export declare const parseXmlBody: (response: HttpResponse) => Promise<any>;
