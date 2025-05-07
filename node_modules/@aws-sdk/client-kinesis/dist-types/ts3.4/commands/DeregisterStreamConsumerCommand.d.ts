import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DeregisterStreamConsumerInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeregisterStreamConsumerCommandInput
  extends DeregisterStreamConsumerInput {}
export interface DeregisterStreamConsumerCommandOutput
  extends __MetadataBearer {}
declare const DeregisterStreamConsumerCommand_base: {
  new (
    input: DeregisterStreamConsumerCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeregisterStreamConsumerCommandInput,
    DeregisterStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [DeregisterStreamConsumerCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    DeregisterStreamConsumerCommandInput,
    DeregisterStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeregisterStreamConsumerCommand extends DeregisterStreamConsumerCommand_base {}
