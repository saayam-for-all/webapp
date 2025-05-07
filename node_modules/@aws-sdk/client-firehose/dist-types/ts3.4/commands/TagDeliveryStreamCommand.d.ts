import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  TagDeliveryStreamInput,
  TagDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface TagDeliveryStreamCommandInput extends TagDeliveryStreamInput {}
export interface TagDeliveryStreamCommandOutput
  extends TagDeliveryStreamOutput,
    __MetadataBearer {}
declare const TagDeliveryStreamCommand_base: {
  new (
    input: TagDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    TagDeliveryStreamCommandInput,
    TagDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: TagDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    TagDeliveryStreamCommandInput,
    TagDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class TagDeliveryStreamCommand extends TagDeliveryStreamCommand_base {}
