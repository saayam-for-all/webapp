import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { PutResourcePolicyInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface PutResourcePolicyCommandInput extends PutResourcePolicyInput {}
export interface PutResourcePolicyCommandOutput extends __MetadataBearer {}
declare const PutResourcePolicyCommand_base: {
  new (
    input: PutResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutResourcePolicyCommandInput,
    PutResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutResourcePolicyCommandInput,
    PutResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutResourcePolicyCommand extends PutResourcePolicyCommand_base {}
