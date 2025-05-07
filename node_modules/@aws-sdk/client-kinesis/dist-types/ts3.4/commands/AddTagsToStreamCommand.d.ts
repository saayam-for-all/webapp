import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { AddTagsToStreamInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface AddTagsToStreamCommandInput extends AddTagsToStreamInput {}
export interface AddTagsToStreamCommandOutput extends __MetadataBearer {}
declare const AddTagsToStreamCommand_base: {
  new (
    input: AddTagsToStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    AddTagsToStreamCommandInput,
    AddTagsToStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: AddTagsToStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    AddTagsToStreamCommandInput,
    AddTagsToStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class AddTagsToStreamCommand extends AddTagsToStreamCommand_base {}
