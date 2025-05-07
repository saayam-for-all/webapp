import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  SubscribeToShardInput,
  SubscribeToShardOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface SubscribeToShardCommandInput extends SubscribeToShardInput {}
export interface SubscribeToShardCommandOutput
  extends SubscribeToShardOutput,
    __MetadataBearer {}
declare const SubscribeToShardCommand_base: {
  new (
    input: SubscribeToShardCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SubscribeToShardCommandInput,
    SubscribeToShardCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: SubscribeToShardCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SubscribeToShardCommandInput,
    SubscribeToShardCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class SubscribeToShardCommand extends SubscribeToShardCommand_base {}
