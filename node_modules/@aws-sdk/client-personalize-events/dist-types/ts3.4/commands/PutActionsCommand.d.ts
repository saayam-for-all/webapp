import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutActionsRequest } from "../models/models_0";
import {
  PersonalizeEventsClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../PersonalizeEventsClient";
export { __MetadataBearer };
export { $Command };
export interface PutActionsCommandInput extends PutActionsRequest {}
export interface PutActionsCommandOutput extends __MetadataBearer {}
declare const PutActionsCommand_base: {
  new (
    input: PutActionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutActionsCommandInput,
    PutActionsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutActionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutActionsCommandInput,
    PutActionsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutActionsCommand extends PutActionsCommand_base {}
