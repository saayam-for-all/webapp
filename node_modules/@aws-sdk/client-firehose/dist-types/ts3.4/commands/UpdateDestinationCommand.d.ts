import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  UpdateDestinationInput,
  UpdateDestinationOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface UpdateDestinationCommandInput extends UpdateDestinationInput {}
export interface UpdateDestinationCommandOutput
  extends UpdateDestinationOutput,
    __MetadataBearer {}
declare const UpdateDestinationCommand_base: {
  new (
    input: UpdateDestinationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateDestinationCommandInput,
    UpdateDestinationCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: UpdateDestinationCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateDestinationCommandInput,
    UpdateDestinationCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateDestinationCommand extends UpdateDestinationCommand_base {}
