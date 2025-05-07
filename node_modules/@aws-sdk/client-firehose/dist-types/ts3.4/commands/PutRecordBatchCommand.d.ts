import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import { PutRecordBatchInput, PutRecordBatchOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutRecordBatchCommandInput extends PutRecordBatchInput {}
export interface PutRecordBatchCommandOutput
  extends PutRecordBatchOutput,
    __MetadataBearer {}
declare const PutRecordBatchCommand_base: {
  new (
    input: PutRecordBatchCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordBatchCommandInput,
    PutRecordBatchCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutRecordBatchCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordBatchCommandInput,
    PutRecordBatchCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutRecordBatchCommand extends PutRecordBatchCommand_base {}
