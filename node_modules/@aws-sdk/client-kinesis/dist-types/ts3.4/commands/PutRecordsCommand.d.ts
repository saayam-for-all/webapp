import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { PutRecordsInput, PutRecordsOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutRecordsCommandInput extends PutRecordsInput {}
export interface PutRecordsCommandOutput
  extends PutRecordsOutput,
    __MetadataBearer {}
declare const PutRecordsCommand_base: {
  new (
    input: PutRecordsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordsCommandInput,
    PutRecordsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutRecordsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutRecordsCommandInput,
    PutRecordsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutRecordsCommand extends PutRecordsCommand_base {}
