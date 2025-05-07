import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import { PutRecordInput, PutRecordOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutRecordCommandInput extends PutRecordInput {}
export interface PutRecordCommandOutput
  extends PutRecordOutput,
    __MetadataBearer {}
declare const PutRecordCommand_base: {
  new (
    input: PutRecordCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordCommandInput,
    PutRecordCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutRecordCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordCommandInput,
    PutRecordCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutRecordCommand extends PutRecordCommand_base {}
