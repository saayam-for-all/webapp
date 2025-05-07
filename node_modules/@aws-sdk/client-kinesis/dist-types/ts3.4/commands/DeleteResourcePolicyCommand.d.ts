import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import { DeleteResourcePolicyInput } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteResourcePolicyCommandInput
  extends DeleteResourcePolicyInput {}
export interface DeleteResourcePolicyCommandOutput extends __MetadataBearer {}
declare const DeleteResourcePolicyCommand_base: {
  new (
    input: DeleteResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteResourcePolicyCommandInput,
    DeleteResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: DeleteResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteResourcePolicyCommandInput,
    DeleteResourcePolicyCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteResourcePolicyCommand extends DeleteResourcePolicyCommand_base {}
