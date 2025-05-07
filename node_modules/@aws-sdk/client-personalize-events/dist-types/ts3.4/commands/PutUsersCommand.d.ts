import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutUsersRequest } from "../models/models_0";
import {
  PersonalizeEventsClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../PersonalizeEventsClient";
export { __MetadataBearer };
export { $Command };
export interface PutUsersCommandInput extends PutUsersRequest {}
export interface PutUsersCommandOutput extends __MetadataBearer {}
declare const PutUsersCommand_base: {
  new (
    input: PutUsersCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutUsersCommandInput,
    PutUsersCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: PutUsersCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutUsersCommandInput,
    PutUsersCommandOutput,
    PersonalizeEventsClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutUsersCommand extends PutUsersCommand_base {}
