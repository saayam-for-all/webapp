import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  UntagDeliveryStreamInput,
  UntagDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UntagDeliveryStreamCommandInput
  extends UntagDeliveryStreamInput {}
export interface UntagDeliveryStreamCommandOutput
  extends UntagDeliveryStreamOutput,
    __MetadataBearer {}
declare const UntagDeliveryStreamCommand_base: {
  new (
    input: UntagDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UntagDeliveryStreamCommandInput,
    UntagDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: UntagDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UntagDeliveryStreamCommandInput,
    UntagDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UntagDeliveryStreamCommand extends UntagDeliveryStreamCommand_base {}
