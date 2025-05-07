import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  StopDeliveryStreamEncryptionInput,
  StopDeliveryStreamEncryptionOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface StopDeliveryStreamEncryptionCommandInput
  extends StopDeliveryStreamEncryptionInput {}
export interface StopDeliveryStreamEncryptionCommandOutput
  extends StopDeliveryStreamEncryptionOutput,
    __MetadataBearer {}
declare const StopDeliveryStreamEncryptionCommand_base: {
  new (
    input: StopDeliveryStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopDeliveryStreamEncryptionCommandInput,
    StopDeliveryStreamEncryptionCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: StopDeliveryStreamEncryptionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopDeliveryStreamEncryptionCommandInput,
    StopDeliveryStreamEncryptionCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StopDeliveryStreamEncryptionCommand extends StopDeliveryStreamEncryptionCommand_base {}
