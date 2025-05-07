import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { ListShardsInput, ListShardsOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListShardsCommandInput extends ListShardsInput {}
export interface ListShardsCommandOutput
  extends ListShardsOutput,
    __MetadataBearer {}
declare const ListShardsCommand_base: {
  new (
    input: ListShardsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListShardsCommandInput,
    ListShardsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListShardsCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListShardsCommandInput,
    ListShardsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListShardsCommand extends ListShardsCommand_base {}
