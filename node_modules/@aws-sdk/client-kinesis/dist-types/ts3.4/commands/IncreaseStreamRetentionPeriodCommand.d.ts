import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { IncreaseStreamRetentionPeriodInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface IncreaseStreamRetentionPeriodCommandInput
  extends IncreaseStreamRetentionPeriodInput {}
export interface IncreaseStreamRetentionPeriodCommandOutput
  extends __MetadataBearer {}
declare const IncreaseStreamRetentionPeriodCommand_base: {
  new (
    input: IncreaseStreamRetentionPeriodCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    IncreaseStreamRetentionPeriodCommandInput,
    IncreaseStreamRetentionPeriodCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: IncreaseStreamRetentionPeriodCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    IncreaseStreamRetentionPeriodCommandInput,
    IncreaseStreamRetentionPeriodCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class IncreaseStreamRetentionPeriodCommand extends IncreaseStreamRetentionPeriodCommand_base {}
