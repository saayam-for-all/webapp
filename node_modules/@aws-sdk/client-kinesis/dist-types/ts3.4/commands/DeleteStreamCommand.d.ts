import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DeleteStreamInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteStreamCommandInput extends DeleteStreamInput {}
export interface DeleteStreamCommandOutput extends __MetadataBearer {}
declare const DeleteStreamCommand_base: {
  new (
    input: DeleteStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteStreamCommandInput,
    DeleteStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DeleteStreamCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteStreamCommandInput,
    DeleteStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteStreamCommand extends DeleteStreamCommand_base {}
