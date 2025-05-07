import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  RegisterStreamConsumerInput,
  RegisterStreamConsumerOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RegisterStreamConsumerCommandInput
  extends RegisterStreamConsumerInput {}
export interface RegisterStreamConsumerCommandOutput
  extends RegisterStreamConsumerOutput,
    __MetadataBearer {}
declare const RegisterStreamConsumerCommand_base: {
  new (
    input: RegisterStreamConsumerCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RegisterStreamConsumerCommandInput,
    RegisterStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: RegisterStreamConsumerCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    RegisterStreamConsumerCommandInput,
    RegisterStreamConsumerCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RegisterStreamConsumerCommand extends RegisterStreamConsumerCommand_base {}
