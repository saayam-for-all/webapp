import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutEventsRequest } from "../models/models_0";
import {
  PersonalizeEventsClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../PersonalizeEventsClient";
export { __MetadataBearer };
export { $Command };
export interface PutEventsCommandInput extends PutEventsRequest {}
export interface PutEventsCommandOutput extends __MetadataBearer {}
declare const PutEventsCommand_base: {
  new (
    input: PutEventsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutEventsCommandInput,
    PutEventsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutEventsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutEventsCommandInput,
    PutEventsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutEventsCommand extends PutEventsCommand_base {}
