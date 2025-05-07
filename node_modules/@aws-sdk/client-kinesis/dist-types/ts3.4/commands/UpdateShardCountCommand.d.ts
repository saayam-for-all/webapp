import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  UpdateShardCountInput,
  UpdateShardCountOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateShardCountCommandInput extends UpdateShardCountInput {}
export interface UpdateShardCountCommandOutput
  extends UpdateShardCountOutput,
    __MetadataBearer {}
declare const UpdateShardCountCommand_base: {
  new (
    input: UpdateShardCountCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateShardCountCommandInput,
    UpdateShardCountCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: UpdateShardCountCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateShardCountCommandInput,
    UpdateShardCountCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateShardCountCommand extends UpdateShardCountCommand_base {}
