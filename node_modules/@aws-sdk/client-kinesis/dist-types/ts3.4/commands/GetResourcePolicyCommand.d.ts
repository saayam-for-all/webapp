import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  GetResourcePolicyInput,
  GetResourcePolicyOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetResourcePolicyCommandInput extends GetResourcePolicyInput {}
export interface GetResourcePolicyCommandOutput
  extends GetResourcePolicyOutput,
    __MetadataBearer {}
declare const GetResourcePolicyCommand_base: {
  new (
    input: GetResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetResourcePolicyCommandInput,
    GetResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: GetResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetResourcePolicyCommandInput,
    GetResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetResourcePolicyCommand extends GetResourcePolicyCommand_base {}
