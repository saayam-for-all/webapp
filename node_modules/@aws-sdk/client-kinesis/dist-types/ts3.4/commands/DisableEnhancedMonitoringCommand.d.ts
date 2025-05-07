import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  DisableEnhancedMonitoringInput,
  EnhancedMonitoringOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DisableEnhancedMonitoringCommandInput
  extends DisableEnhancedMonitoringInput {}
export interface DisableEnhancedMonitoringCommandOutput
  extends EnhancedMonitoringOutput,
    __MetadataBearer {}
declare const DisableEnhancedMonitoringCommand_base: {
  new (
    input: DisableEnhancedMonitoringCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableEnhancedMonitoringCommandInput,
    DisableEnhancedMonitoringCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: DisableEnhancedMonitoringCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DisableEnhancedMonitoringCommandInput,
    DisableEnhancedMonitoringCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DisableEnhancedMonitoringCommand extends DisableEnhancedMonitoringCommand_base {}
