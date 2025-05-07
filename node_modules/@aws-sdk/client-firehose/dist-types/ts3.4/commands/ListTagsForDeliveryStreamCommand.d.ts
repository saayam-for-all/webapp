import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  ListTagsForDeliveryStreamInput,
  ListTagsForDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListTagsForDeliveryStreamCommandInput
  extends ListTagsForDeliveryStreamInput {}
export interface ListTagsForDeliveryStreamCommandOutput
  extends ListTagsForDeliveryStreamOutput,
    __MetadataBearer {}
declare const ListTagsForDeliveryStreamCommand_base: {
  new (
    input: ListTagsForDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListTagsForDeliveryStreamCommandInput,
    ListTagsForDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: ListTagsForDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListTagsForDeliveryStreamCommandInput,
    ListTagsForDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListTagsForDeliveryStreamCommand extends ListTagsForDeliveryStreamCommand_base {}
