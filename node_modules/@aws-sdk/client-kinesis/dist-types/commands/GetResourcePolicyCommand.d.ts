import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../KinesisClient";
import { GetResourcePolicyInput, GetResourcePolicyOutput } from "../models/models_0";
/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link GetResourcePolicyCommand}.
 */
export interface GetResourcePolicyCommandInput extends GetResourcePolicyInput {
}
/**
 * @public
 *
 * The output of {@link GetResourcePolicyCommand}.
 */
export interface GetResourcePolicyCommandOutput extends GetResourcePolicyOutput, __MetadataBearer {
}
declare const GetResourcePolicyCommand_base: {
    new (input: GetResourcePolicyCommandInput): import("@smithy/smithy-client").CommandImpl<GetResourcePolicyCommandInput, GetResourcePolicyCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    new (__0_0: GetResourcePolicyCommandInput): import("@smithy/smithy-client").CommandImpl<GetResourcePolicyCommandInput, GetResourcePolicyCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
/**
 * <p>Returns a policy attached to the specified data stream or consumer. Request patterns can be one of the following:</p>
 *          <ul>
 *             <li>
 *                <p>Data stream pattern: <code>arn:aws.*:kinesis:.*:\d\{12\}:.*stream/\S+</code>
 *                </p>
 *             </li>
 *             <li>
 *                <p> Consumer pattern: <code>^(arn):aws.*:kinesis:.*:\d\{12\}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+</code>
 *                </p>
 *             </li>
 *          </ul>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { KinesisClient, GetResourcePolicyCommand } from "@aws-sdk/client-kinesis"; // ES Modules import
 * // const { KinesisClient, GetResourcePolicyCommand } = require("@aws-sdk/client-kinesis"); // CommonJS import
 * const client = new KinesisClient(config);
 * const input = { // GetResourcePolicyInput
 *   ResourceARN: "STRING_VALUE", // required
 * };
 * const command = new GetResourcePolicyCommand(input);
 * const response = await client.send(command);
 * // { // GetResourcePolicyOutput
 * //   Policy: "STRING_VALUE", // required
 * // };
 *
 * ```
 *
 * @param GetResourcePolicyCommandInput - {@link GetResourcePolicyCommandInput}
 * @returns {@link GetResourcePolicyCommandOutput}
 * @see {@link GetResourcePolicyCommandInput} for command's `input` shape.
 * @see {@link GetResourcePolicyCommandOutput} for command's `response` shape.
 * @see {@link KinesisClientResolvedConfig | config} for KinesisClient's `config` shape.
 *
 * @throws {@link AccessDeniedException} (client fault)
 *  <p>Specifies that you do not have the permissions required to perform this
 *             operation.</p>
 *
 * @throws {@link InvalidArgumentException} (client fault)
 *  <p>A specified parameter exceeds its restrictions, is not supported, or can't be used.
 *             For more information, see the returned message.</p>
 *
 * @throws {@link LimitExceededException} (client fault)
 *  <p>The requested resource exceeds the maximum number allowed, or the number of concurrent
 *             stream requests exceeds the maximum number allowed. </p>
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
export declare class GetResourcePolicyCommand extends GetResourcePolicyCommand_base {
}
