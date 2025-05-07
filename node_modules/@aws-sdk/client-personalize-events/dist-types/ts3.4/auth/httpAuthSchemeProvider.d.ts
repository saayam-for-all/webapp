import {
  AwsSdkSigV4AuthInputConfig,
  AwsSdkSigV4AuthResolvedConfig,
  AwsSdkSigV4PreviouslyResolved,
} from "@aws-sdk/core";
import {
  HandlerExecutionContext,
  HttpAuthScheme,
  HttpAuthSchemeParameters,
  HttpAuthSchemeParametersProvider,
  HttpAuthSchemeProvider,
} from "@smithy/types";
import { PersonalizeEventsClientResolvedConfig } from "../PersonalizeEventsClient";
export interface PersonalizeEventsHttpAuthSchemeParameters
  extends HttpAuthSchemeParameters {
  region?: string;
}
export interface PersonalizeEventsHttpAuthSchemeParametersProvider
  extends HttpAuthSchemeParametersProvider<
    PersonalizeEventsClientResolvedConfig,
    HandlerExecutionContext,
    PersonalizeEventsHttpAuthSchemeParameters,
    object
  > {}
export declare const defaultPersonalizeEventsHttpAuthSchemeParametersProvider: (
  config: PersonalizeEventsClientResolvedConfig,
  context: HandlerExecutionContext,
  input: object
) => Promise<PersonalizeEventsHttpAuthSchemeParameters>;
export interface PersonalizeEventsHttpAuthSchemeProvider
  extends HttpAuthSchemeProvider<PersonalizeEventsHttpAuthSchemeParameters> {}
export declare const defaultPersonalizeEventsHttpAuthSchemeProvider: PersonalizeEventsHttpAuthSchemeProvider;
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
  httpAuthSchemes?: HttpAuthScheme[];
  httpAuthSchemeProvider?: PersonalizeEventsHttpAuthSchemeProvider;
}
export interface HttpAuthSchemeResolvedConfig
  extends AwsSdkSigV4AuthResolvedConfig {
  readonly httpAuthSchemes: HttpAuthScheme[];
  readonly httpAuthSchemeProvider: PersonalizeEventsHttpAuthSchemeProvider;
}
export declare const resolveHttpAuthSchemeConfig: <T>(
  config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved
) => T & HttpAuthSchemeResolvedConfig;
