import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DescribeLimitsInput, DescribeLimitsOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeLimitsCommandInput extends DescribeLimitsInput {}
export interface DescribeLimitsCommandOutput
  extends DescribeLimitsOutput,
    __MetadataBearer {}
declare const DescribeLimitsCommand_base: {
  new (
    input: DescribeLimitsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeLimitsCommandInput,
    DescribeLimitsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DescribeLimitsCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeLimitsCommandInput,
    DescribeLimitsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeLimitsCommand extends DescribeLimitsCommand_base {}
