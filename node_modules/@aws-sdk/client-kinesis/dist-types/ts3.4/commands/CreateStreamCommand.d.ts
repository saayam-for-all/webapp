import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { CreateStreamInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateStreamCommandInput extends CreateStreamInput {}
export interface CreateStreamCommandOutput extends __MetadataBearer {}
declare const CreateStreamCommand_base: {
  new (
    input: CreateStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateStreamCommandInput,
    CreateStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: CreateStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateStreamCommandInput,
    CreateStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateStreamCommand extends CreateStreamCommand_base {}
