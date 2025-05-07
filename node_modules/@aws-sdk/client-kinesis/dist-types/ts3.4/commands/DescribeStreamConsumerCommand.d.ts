import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  DescribeStreamConsumerInput,
  DescribeStreamConsumerOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeStreamConsumerCommandInput
  extends DescribeStreamConsumerInput {}
export interface DescribeStreamConsumerCommandOutput
  extends DescribeStreamConsumerOutput,
    __MetadataBearer {}
declare const DescribeStreamConsumerCommand_base: {
  new (
    input: DescribeStreamConsumerCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamConsumerCommandInput,
    DescribeStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DescribeStreamConsumerCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamConsumerCommandInput,
    DescribeStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeStreamConsumerCommand extends DescribeStreamConsumerCommand_base {}
