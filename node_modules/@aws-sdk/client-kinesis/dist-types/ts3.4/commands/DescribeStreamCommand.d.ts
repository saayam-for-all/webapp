import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DescribeStreamInput, DescribeStreamOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeStreamCommandInput extends DescribeStreamInput {}
export interface DescribeStreamCommandOutput
  extends DescribeStreamOutput,
    __MetadataBearer {}
declare const DescribeStreamCommand_base: {
  new (
    input: DescribeStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamCommandInput,
    DescribeStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DescribeStreamCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamCommandInput,
    DescribeStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeStreamCommand extends DescribeStreamCommand_base {}
