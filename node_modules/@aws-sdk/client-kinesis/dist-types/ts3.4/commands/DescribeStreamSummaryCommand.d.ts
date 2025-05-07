import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  DescribeStreamSummaryInput,
  DescribeStreamSummaryOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeStreamSummaryCommandInput
  extends DescribeStreamSummaryInput {}
export interface DescribeStreamSummaryCommandOutput
  extends DescribeStreamSummaryOutput,
    __MetadataBearer {}
declare const DescribeStreamSummaryCommand_base: {
  new (
    input: DescribeStreamSummaryCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamSummaryCommandInput,
    DescribeStreamSummaryCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DescribeStreamSummaryCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeStreamSummaryCommandInput,
    DescribeStreamSummaryCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeStreamSummaryCommand extends DescribeStreamSummaryCommand_base {}
