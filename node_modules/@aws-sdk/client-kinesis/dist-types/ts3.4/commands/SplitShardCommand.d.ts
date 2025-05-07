import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { SplitShardInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface SplitShardCommandInput extends SplitShardInput {}
export interface SplitShardCommandOutput extends __MetadataBearer {}
declare const SplitShardCommand_base: {
  new (
    input: SplitShardCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SplitShardCommandInput,
    SplitShardCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: SplitShardCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SplitShardCommandInput,
    SplitShardCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class SplitShardCommand extends SplitShardCommand_base {}
