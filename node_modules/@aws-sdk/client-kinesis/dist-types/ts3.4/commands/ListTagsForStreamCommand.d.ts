import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  ListTagsForStreamInput,
  ListTagsForStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListTagsForStreamCommandInput extends ListTagsForStreamInput {}
export interface ListTagsForStreamCommandOutput
  extends ListTagsForStreamOutput,
    __MetadataBearer {}
declare const ListTagsForStreamCommand_base: {
  new (
    input: ListTagsForStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListTagsForStreamCommandInput,
    ListTagsForStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListTagsForStreamCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListTagsForStreamCommandInput,
    ListTagsForStreamCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListTagsForStreamCommand extends ListTagsForStreamCommand_base {}
