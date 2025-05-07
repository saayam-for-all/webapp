import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../KinesisClient";
import { DescribeLimitsInput, DescribeLimitsOutput } from "../models/models_0";
/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link DescribeLimitsCommand}.
 */
export interface DescribeLimitsCommandInput extends DescribeLimitsInput {
}
/**
 * @public
 *
 * The output of {@link DescribeLimitsCommand}.
 */
export interface DescribeLimitsCommandOutput extends DescribeLimitsOutput, __MetadataBearer {
}
declare const DescribeLimitsCommand_base: {
    new (input: DescribeLimitsCommandInput): import("@smithy/smithy-client").CommandImpl<DescribeLimitsCommandInput, DescribeLimitsCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    new (...[input]: [] | [DescribeLimitsCommandInput]): import("@smithy/smithy-client").CommandImpl<DescribeLimitsCommandInput, DescribeLimitsCommandOutput, KinesisClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>;
    getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
/**
 * <p>Describes the shard limits and usage for the account.</p>
 *          <p>If you update your account limits, the old limits might be returned for a few
 *             minutes.</p>
 *          <p>This operation has a limit of one transaction per second per account.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { KinesisClient, DescribeLimitsCommand } from "@aws-sdk/client-kinesis"; // ES Modules import
 * // const { KinesisClient, DescribeLimitsCommand } = require("@aws-sdk/client-kinesis"); // CommonJS import
 * const client = new KinesisClient(config);
 * const input = {};
 * const command = new DescribeLimitsCommand(input);
 * const response = await client.send(command);
 * // { // DescribeLimitsOutput
 * //   ShardLimit: Number("int"), // required
 * //   OpenShardCount: Number("int"), // required
 * //   OnDemandStreamCount: Number("int"), // required
 * //   OnDemandStreamCountLimit: Number("int"), // required
 * // };
 *
 * ```
 *
 * @param DescribeLimitsCommandInput - {@link DescribeLimitsCommandInput}
 * @returns {@link DescribeLimitsCommandOutput}
 * @see {@link DescribeLimitsCommandInput} for command's `input` shape.
 * @see {@link DescribeLimitsCommandOutput} for command's `response` shape.
 * @see {@link KinesisClientResolvedConfig | config} for KinesisClient's `config` shape.
 *
 * @throws {@link LimitExceededException} (client fault)
 *  <p>The requested resource exceeds the maximum number allowed, or the number of concurrent
 *             stream requests exceeds the maximum number allowed. </p>
 *
 * @throws {@link KinesisServiceException}
 * <p>Base exception class for all service exceptions from Kinesis service.</p>
 *
 * @public
 */
export declare class DescribeLimitsCommand extends DescribeLimitsCommand_base {
}
