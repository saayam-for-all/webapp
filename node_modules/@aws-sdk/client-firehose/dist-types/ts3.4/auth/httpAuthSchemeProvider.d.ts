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
import { FirehoseClientResolvedConfig } from "../FirehoseClient";
export interface FirehoseHttpAuthSchemeParameters
  extends HttpAuthSchemeParameters {
  region?: string;
}
export interface FirehoseHttpAuthSchemeParametersProvider
  extends HttpAuthSchemeParametersProvider<
    FirehoseClientResolvedConfig,
    HandlerExecutionContext,
    FirehoseHttpAuthSchemeParameters,
    object
  > {}
export declare const defaultFirehoseHttpAuthSchemeParametersProvider: (
  config: FirehoseClientResolvedConfig,
  context: HandlerExecutionContext,
  input: object
) => Promise<FirehoseHttpAuthSchemeParameters>;
export interface FirehoseHttpAuthSchemeProvider
  extends HttpAuthSchemeProvider<FirehoseHttpAuthSchemeParameters> {}
export declare const defaultFirehoseHttpAuthSchemeProvider: FirehoseHttpAuthSchemeProvider;
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
  httpAuthSchemes?: HttpAuthScheme[];
  httpAuthSchemeProvider?: FirehoseHttpAuthSchemeProvider;
}
export interface HttpAuthSchemeResolvedConfig
  extends AwsSdkSigV4AuthResolvedConfig {
  readonly httpAuthSchemes: HttpAuthScheme[];
  readonly httpAuthSchemeProvider: FirehoseHttpAuthSchemeProvider;
}
export declare const resolveHttpAuthSchemeConfig: <T>(
  config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved
) => T & HttpAuthSchemeResolvedConfig;
