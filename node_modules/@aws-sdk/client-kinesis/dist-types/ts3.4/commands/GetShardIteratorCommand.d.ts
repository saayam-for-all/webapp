import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  GetShardIteratorInput,
  GetShardIteratorOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetShardIteratorCommandInput extends GetShardIteratorInput {}
export interface GetShardIteratorCommandOutput
  extends GetShardIteratorOutput,
    __MetadataBearer {}
declare const GetShardIteratorCommand_base: {
  new (
    input: GetShardIteratorCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetShardIteratorCommandInput,
    GetShardIteratorCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: GetShardIteratorCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetShardIteratorCommandInput,
    GetShardIteratorCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetShardIteratorCommand extends GetShardIteratorCommand_base {}
