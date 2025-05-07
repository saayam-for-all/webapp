import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  DescribeDeliveryStreamInput,
  DescribeDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeDeliveryStreamCommandInput
  extends DescribeDeliveryStreamInput {}
export interface DescribeDeliveryStreamCommandOutput
  extends DescribeDeliveryStreamOutput,
    __MetadataBearer {}
declare const DescribeDeliveryStreamCommand_base: {
  new (
    input: DescribeDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeDeliveryStreamCommandInput,
    DescribeDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: DescribeDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeDeliveryStreamCommandInput,
    DescribeDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeDeliveryStreamCommand extends DescribeDeliveryStreamCommand_base {}
