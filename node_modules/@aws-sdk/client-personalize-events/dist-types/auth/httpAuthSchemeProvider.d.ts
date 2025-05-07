import { AwsSdkSigV4AuthInputConfig, AwsSdkSigV4AuthResolvedConfig, AwsSdkSigV4PreviouslyResolved } from "@aws-sdk/core";
import { HandlerExecutionContext, HttpAuthScheme, HttpAuthSchemeParameters, HttpAuthSchemeParametersProvider, HttpAuthSchemeProvider } from "@smithy/types";
import { PersonalizeEventsClientResolvedConfig } from "../PersonalizeEventsClient";
/**
 * @internal
 */
export interface PersonalizeEventsHttpAuthSchemeParameters extends HttpAuthSchemeParameters {
    region?: string;
}
/**
 * @internal
 */
export interface PersonalizeEventsHttpAuthSchemeParametersProvider extends HttpAuthSchemeParametersProvider<PersonalizeEventsClientResolvedConfig, HandlerExecutionContext, PersonalizeEventsHttpAuthSchemeParameters, object> {
}
/**
 * @internal
 */
export declare const defaultPersonalizeEventsHttpAuthSchemeParametersProvider: (config: PersonalizeEventsClientResolvedConfig, context: HandlerExecutionContext, input: object) => Promise<PersonalizeEventsHttpAuthSchemeParameters>;
/**
 * @internal
 */
export interface PersonalizeEventsHttpAuthSchemeProvider extends HttpAuthSchemeProvider<PersonalizeEventsHttpAuthSchemeParameters> {
}
/**
 * @internal
 */
export declare const defaultPersonalizeEventsHttpAuthSchemeProvider: PersonalizeEventsHttpAuthSchemeProvider;
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
    httpAuthSchemeProvider?: PersonalizeEventsHttpAuthSchemeProvider;
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
    readonly httpAuthSchemeProvider: PersonalizeEventsHttpAuthSchemeProvider;
}
/**
 * @internal
 */
export declare const resolveHttpAuthSchemeConfig: <T>(config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved) => T & HttpAuthSchemeResolvedConfig;
