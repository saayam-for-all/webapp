import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  KinesisClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../KinesisClient";
import {
  EnableEnhancedMonitoringInput,
  EnhancedMonitoringOutput,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface EnableEnhancedMonitoringCommandInput
  extends EnableEnhancedMonitoringInput {}
export interface EnableEnhancedMonitoringCommandOutput
  extends EnhancedMonitoringOutput,
    __MetadataBearer {}
declare const EnableEnhancedMonitoringCommand_base: {
  new (
    input: EnableEnhancedMonitoringCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableEnhancedMonitoringCommandInput,
    EnableEnhancedMonitoringCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    __0_0: EnableEnhancedMonitoringCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    EnableEnhancedMonitoringCommandInput,
    EnableEnhancedMonitoringCommandOutput,
    KinesisClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class EnableEnhancedMonitoringCommand extends EnableEnhancedMonitoringCommand_base {}
