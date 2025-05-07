import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { UpdateStreamModeInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateStreamModeCommandInput extends UpdateStreamModeInput {}
export interface UpdateStreamModeCommandOutput extends __MetadataBearer {}
declare const UpdateStreamModeCommand_base: {
  new (
    input: UpdateStreamModeCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateStreamModeCommandInput,
    UpdateStreamModeCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: UpdateStreamModeCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateStreamModeCommandInput,
    UpdateStreamModeCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateStreamModeCommand extends UpdateStreamModeCommand_base {}
