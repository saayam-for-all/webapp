import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutActionInteractionsRequest } from "../models/models_0";
import {
  PersonalizeEventsClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../PersonalizeEventsClient";
export { __MetadataBearer };
export { $Command };
export interface PutActionInteractionsCommandInput
  extends PutActionInteractionsRequest {}
export interface PutActionInteractionsCommandOutput extends __MetadataBearer {}
declare const PutActionInteractionsCommand_base: {
  new (
    input: PutActionInteractionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutActionInteractionsCommandInput,
    PutActionInteractionsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutActionInteractionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutActionInteractionsCommandInput,
    PutActionInteractionsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutActionInteractionsCommand extends PutActionInteractionsCommand_base {}
