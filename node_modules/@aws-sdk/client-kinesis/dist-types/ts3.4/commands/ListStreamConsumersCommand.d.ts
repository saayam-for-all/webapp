import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  ListStreamConsumersInput,
  ListStreamConsumersOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListStreamConsumersCommandInput
  extends ListStreamConsumersInput {}
export interface ListStreamConsumersCommandOutput
  extends ListStreamConsumersOutput,
    __MetadataBearer {}
declare const ListStreamConsumersCommand_base: {
  new (
    input: ListStreamConsumersCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListStreamConsumersCommandInput,
    ListStreamConsumersCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: ListStreamConsumersCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListStreamConsumersCommandInput,
    ListStreamConsumersCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListStreamConsumersCommand extends ListStreamConsumersCommand_base {}
