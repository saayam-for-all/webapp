import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { StartStreamEncryptionInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface StartStreamEncryptionCommandInput
  extends StartStreamEncryptionInput {}
export interface StartStreamEncryptionCommandOutput extends __MetadataBearer {}
declare const StartStreamEncryptionCommand_base: {
  new (
    input: StartStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartStreamEncryptionCommandInput,
    StartStreamEncryptionCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: StartStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartStreamEncryptionCommandInput,
    StartStreamEncryptionCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StartStreamEncryptionCommand extends StartStreamEncryptionCommand_base {}
