import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutItemsRequest } from "../models/models_0";
import {
  PersonalizeEventsClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../PersonalizeEventsClient";
export { __MetadataBearer };
export { $Command };
export interface PutItemsCommandInput extends PutItemsRequest {}
export interface PutItemsCommandOutput extends __MetadataBearer {}
declare const PutItemsCommand_base: {
  new (
    input: PutItemsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutItemsCommandInput,
    PutItemsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutItemsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutItemsCommandInput,
    PutItemsCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutItemsCommand extends PutItemsCommand_base {}
