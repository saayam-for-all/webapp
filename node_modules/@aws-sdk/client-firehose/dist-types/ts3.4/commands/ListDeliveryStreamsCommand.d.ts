import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  ListDeliveryStreamsInput,
  ListDeliveryStreamsOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListDeliveryStreamsCommandInput
  extends ListDeliveryStreamsInput {}
export interface ListDeliveryStreamsCommandOutput
  extends ListDeliveryStreamsOutput,
    __MetadataBearer {}
declare const ListDeliveryStreamsCommand_base: {
  new (
    input: ListDeliveryStreamsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDeliveryStreamsCommandInput,
    ListDeliveryStreamsCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListDeliveryStreamsCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListDeliveryStreamsCommandInput,
    ListDeliveryStreamsCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListDeliveryStreamsCommand extends ListDeliveryStreamsCommand_base {}
