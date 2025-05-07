import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { StopStreamEncryptionInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface StopStreamEncryptionCommandInput
  extends StopStreamEncryptionInput {}
export interface StopStreamEncryptionCommandOutput extends __MetadataBearer {}
declare const StopStreamEncryptionCommand_base: {
  new (
    input: StopStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopStreamEncryptionCommandInput,
    StopStreamEncryptionCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: StopStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopStreamEncryptionCommandInput,
    StopStreamEncryptionCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StopStreamEncryptionCommand extends StopStreamEncryptionCommand_base {}
