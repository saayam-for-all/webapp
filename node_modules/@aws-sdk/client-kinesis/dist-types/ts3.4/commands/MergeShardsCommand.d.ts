import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { MergeShardsInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface MergeShardsCommandInput extends MergeShardsInput {}
export interface MergeShardsCommandOutput extends __MetadataBearer {}
declare const MergeShardsCommand_base: {
  new (
    input: MergeShardsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    MergeShardsCommandInput,
    MergeShardsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: MergeShardsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    MergeShardsCommandInput,
    MergeShardsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class MergeShardsCommand extends MergeShardsCommand_base {}
