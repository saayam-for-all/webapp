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
import { KinesisClientResolvedConfig } from "../KinesisClient";
export interface KinesisHttpAuthSchemeParameters
  extends HttpAuthSchemeParameters {
  region?: string;
}
export interface KinesisHttpAuthSchemeParametersProvider
  extends HttpAuthSchemeParametersProvider<
    KinesisClientResolvedConfig,
    HandlerExecutionContext,
    KinesisHttpAuthSchemeParameters,
    object
  > {}
export declare const defaultKinesisHttpAuthSchemeParametersProvider: (
  config: KinesisClientResolvedConfig,
  context: HandlerExecutionContext,
  input: object
) => Promise<KinesisHttpAuthSchemeParameters>;
export interface KinesisHttpAuthSchemeProvider
  extends HttpAuthSchemeProvider<KinesisHttpAuthSchemeParameters> {}
export declare const defaultKinesisHttpAuthSchemeProvider: KinesisHttpAuthSchemeProvider;
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
  httpAuthSchemes?: HttpAuthScheme[];
  httpAuthSchemeProvider?: KinesisHttpAuthSchemeProvider;
}
export interface HttpAuthSchemeResolvedConfig
  extends AwsSdkSigV4AuthResolvedConfig {
  readonly httpAuthSchemes: HttpAuthScheme[];
  readonly httpAuthSchemeProvider: KinesisHttpAuthSchemeProvider;
}
export declare const resolveHttpAuthSchemeConfig: <T>(
  config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved
) => T & HttpAuthSchemeResolvedConfig;
