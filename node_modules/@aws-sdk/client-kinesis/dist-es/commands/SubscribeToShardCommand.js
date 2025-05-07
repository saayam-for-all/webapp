import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { SubscribeToShardOutputFilterSensitiveLog, } from "../models/models_0";
import { de_SubscribeToShardCommand, se_SubscribeToShardCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class SubscribeToShardCommand extends $Command
    .classBuilder()
    .ep({
    ...commonParams,
    OperationType: { type: "staticContextParams", value: `data` },
    ConsumerARN: { type: "contextParams", name: "ConsumerARN" },
})
    .m(function (Command, cs, config, o) {
    return [
        getSerdePlugin(config, this.serialize, this.deserialize),
        getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("Kinesis_20131202", "SubscribeToShard", {
    eventStream: {
        output: true,
    },
})
    .n("KinesisClient", "SubscribeToShardCommand")
    .f(void 0, SubscribeToShardOutputFilterSensitiveLog)
    .ser(se_SubscribeToShardCommand)
    .de(de_SubscribeToShardCommand)
    .build() {
}
