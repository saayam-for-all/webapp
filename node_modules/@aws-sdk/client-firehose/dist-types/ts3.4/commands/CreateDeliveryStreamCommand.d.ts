import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  CreateDeliveryStreamInput,
  CreateDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateDeliveryStreamCommandInput
  extends CreateDeliveryStreamInput {}
export interface CreateDeliveryStreamCommandOutput
  extends CreateDeliveryStreamOutput,
    __MetadataBearer {}
declare const CreateDeliveryStreamCommand_base: {
  new (
    input: CreateDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateDeliveryStreamCommandInput,
    CreateDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: CreateDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateDeliveryStreamCommandInput,
    CreateDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateDeliveryStreamCommand extends CreateDeliveryStreamCommand_base {}
