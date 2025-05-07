import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { GetRecordsInput, GetRecordsOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetRecordsCommandInput extends GetRecordsInput {}
export interface GetRecordsCommandOutput
  extends GetRecordsOutput,
    __MetadataBearer {}
declare const GetRecordsCommand_base: {
  new (
    input: GetRecordsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetRecordsCommandInput,
    GetRecordsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: GetRecordsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetRecordsCommandInput,
    GetRecordsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetRecordsCommand extends GetRecordsCommand_base {}
