import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  StartDeliveryStreamEncryptionInput,
  StartDeliveryStreamEncryptionOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface StartDeliveryStreamEncryptionCommandInput
  extends StartDeliveryStreamEncryptionInput {}
export interface StartDeliveryStreamEncryptionCommandOutput
  extends StartDeliveryStreamEncryptionOutput,
    __MetadataBearer {}
declare const StartDeliveryStreamEncryptionCommand_base: {
  new (
    input: StartDeliveryStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartDeliveryStreamEncryptionCommandInput,
    StartDeliveryStreamEncryptionCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: StartDeliveryStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StartDeliveryStreamEncryptionCommandInput,
    StartDeliveryStreamEncryptionCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StartDeliveryStreamEncryptionCommand extends StartDeliveryStreamEncryptionCommand_base {}
