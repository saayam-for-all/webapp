import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  FirehoseClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../FirehoseClient";
import {
  DeleteDeliveryStreamInput,
  DeleteDeliveryStreamOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteDeliveryStreamCommandInput
  extends DeleteDeliveryStreamInput {}
export interface DeleteDeliveryStreamCommandOutput
  extends DeleteDeliveryStreamOutput,
    __MetadataBearer {}
declare const DeleteDeliveryStreamCommand_base: {
  new (
    input: DeleteDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteDeliveryStreamCommandInput,
    DeleteDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: DeleteDeliveryStreamCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteDeliveryStreamCommandInput,
    DeleteDeliveryStreamCommandOutput,
    FirehoseClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteDeliveryStreamCommand extends DeleteDeliveryStreamCommand_base {}
