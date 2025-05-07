import { AwsSdkSigV4AuthInputConfig, AwsSdkSigV4AuthResolvedConfig, AwsSdkSigV4PreviouslyResolved } from "@aws-sdk/core";
import { HandlerExecutionContext, HttpAuthScheme, HttpAuthSchemeParameters, HttpAuthSchemeParametersProvider, HttpAuthSchemeProvider } from "@smithy/types";
import { FirehoseClientResolvedConfig } from "../FirehoseClient";
/**
 * @internal
 */
export interface FirehoseHttpAuthSchemeParameters extends HttpAuthSchemeParameters {
    region?: string;
}
/**
 * @internal
 */
export interface FirehoseHttpAuthSchemeParametersProvider extends HttpAuthSchemeParametersProvider<FirehoseClientResolvedConfig, HandlerExecutionContext, FirehoseHttpAuthSchemeParameters, object> {
}
/**
 * @internal
 */
export declare const defaultFirehoseHttpAuthSchemeParametersProvider: (config: FirehoseClientResolvedConfig, context: HandlerExecutionContext, input: object) => Promise<FirehoseHttpAuthSchemeParameters>;
/**
 * @internal
 */
export interface FirehoseHttpAuthSchemeProvider extends HttpAuthSchemeProvider<FirehoseHttpAuthSchemeParameters> {
}
/**
 * @internal
 */
export declare const defaultFirehoseHttpAuthSchemeProvider: FirehoseHttpAuthSchemeProvider;
/**
 * @internal
 */
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
    /**
     * experimentalIdentityAndAuth: Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
     * @internal
     */
    httpAuthSchemes?: HttpAuthScheme[];
    /**
     * experimentalIdentityAndAuth: Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
     * @internal
     */
    httpAuthSchemeProvider?: FirehoseHttpAuthSchemeProvider;
}
/**
 * @internal
 */
export interface HttpAuthSchemeResolvedConfig extends AwsSdkSigV4AuthResolvedConfig {
    /**
     * experimentalIdentityAndAuth: Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
     * @internal
     */
    readonly httpAuthSchemes: HttpAuthScheme[];
    /**
     * experimentalIdentityAndAuth: Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
     * @internal
     */
    readonly httpAuthSchemeProvider: FirehoseHttpAuthSchemeProvider;
}
/**
 * @internal
 */
export declare const resolveHttpAuthSchemeConfig: <T>(config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved) => T & HttpAuthSchemeResolvedConfig;
