import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../KinesisClient";
import { UpdateStreamModeInput } from "../models/models_0";
/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link UpdateStreamModeCommand}.
 */
export interface UpdateStreamModeCommandInput extends UpdateStreamModeInput {
}
/**
 * @public
 *
 * The output of {@link UpdateStreamModeCommand}.
 */
export interface UpdateStreamModeCommandOutput extends __MetadataBearer {
}
declare const UpdateStreamModeCommand_base: {
    new (input: UpdateStreamModeCommandInput): import("@smithy/smithy-client").CommandImpl<UpdateStreamModeCommandInput, UpdateStreamModeCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    new (__0_0: UpdateStreamModeCommandInput): import("@smithy/smithy-client").CommandImpl<UpdateStreamModeCommandInput, UpdateStreamModeCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
/**
 * <p> Updates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you
 *             can choose between an <b>on-demand</b> capacity mode and a
 *                 <b>provisioned</b> capacity mode for your data stream.
 *         </p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { KinesisClient, UpdateStreamModeCommand } from "@aws-sdk/client-kinesis"; // ES Modules import
 * // const { KinesisClient, UpdateStreamModeCommand } = require("@aws-sdk/client-kinesis"); // CommonJS import
 * const client = new KinesisClient(config);
 * const input = { // UpdateStreamModeInput
 *   StreamARN: "STRING_VALUE", // required
 *   StreamModeDetails: { // StreamModeDetails
 *     StreamMode: "PROVISIONED" || "ON_DEMAND", // required
 *   },
 * };
 * const command = new UpdateStreamModeCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param UpdateStreamModeCommandInput - {@link UpdateStreamModeCommandInput}
 * @returns {@link UpdateStreamModeCommandOutput}
 * @see {@link UpdateStreamModeCommandInput} for command's `input` shape.
 * @see {@link UpdateStreamModeCommandOutput} for command's `response` shape.
 * @see {@link KinesisClientResolvedConfig | config} for KinesisClient's `config` shape.
 *
 * @throws {@link InvalidArgumentException} (client fault)
 *  <p>A specified parameter exceeds its restrictions, is not supported, or can't be used.
 *             For more information, see the returned message.</p>
 *
 * @throws {@link LimitExceededException} (client fault)
 *  <p>The requested resource exceeds the maximum number allowed, or the number of concurrent
 *             stream requests exceeds the maximum number allowed. </p>
 *
 * @throws {@link ResourceInUseException} (client fault)
 *  <p>The resource is not available for this operation. For successful operation, the
 *             resource must be in the <code>ACTIVE</code> state.</p>
 *
 * @throws {@link ResourceNotFoundException} (client fault)
 *  <p>The requested resource could not be found. The stream might not be specified
 *             correctly.</p>
 *
 * @throws {@link KinesisServiceException}
 * <p>Base exception class for all service exceptions from Kinesis service.</p>
 *
 * @public
 */
export declare class UpdateStreamModeCommand extends UpdateStreamModeCommand_base {
}
