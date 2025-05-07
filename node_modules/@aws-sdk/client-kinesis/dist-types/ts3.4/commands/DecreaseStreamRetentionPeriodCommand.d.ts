import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DecreaseStreamRetentionPeriodInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DecreaseStreamRetentionPeriodCommandInput
  extends DecreaseStreamRetentionPeriodInput {}
export interface DecreaseStreamRetentionPeriodCommandOutput
  extends __MetadataBearer {}
declare const DecreaseStreamRetentionPeriodCommand_base: {
  new (
    input: DecreaseStreamRetentionPeriodCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DecreaseStreamRetentionPeriodCommandInput,
    DecreaseStreamRetentionPeriodCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: DecreaseStreamRetentionPeriodCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DecreaseStreamRetentionPeriodCommandInput,
    DecreaseStreamRetentionPeriodCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DecreaseStreamRetentionPeriodCommand extends DecreaseStreamRetentionPeriodCommand_base {}
