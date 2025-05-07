import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { ListStreamsInput, ListStreamsOutput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListStreamsCommandInput extends ListStreamsInput {}
export interface ListStreamsCommandOutput
  extends ListStreamsOutput,
    __MetadataBearer {}
declare const ListStreamsCommand_base: {
  new (
    input: ListStreamsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListStreamsCommandInput,
    ListStreamsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListStreamsCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListStreamsCommandInput,
    ListStreamsCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListStreamsCommand extends ListStreamsCommand_base {}
