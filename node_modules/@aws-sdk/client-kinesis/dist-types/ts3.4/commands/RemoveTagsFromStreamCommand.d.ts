import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { RemoveTagsFromStreamInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RemoveTagsFromStreamCommandInput
  extends RemoveTagsFromStreamInput {}
export interface RemoveTagsFromStreamCommandOutput extends __MetadataBearer {}
declare const RemoveTagsFromStreamCommand_base: {
  new (
    input: RemoveTagsFromStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RemoveTagsFromStreamCommandInput,
    RemoveTagsFromStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: RemoveTagsFromStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RemoveTagsFromStreamCommandInput,
    RemoveTagsFromStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RemoveTagsFromStreamCommand extends RemoveTagsFromStreamCommand_base {}
