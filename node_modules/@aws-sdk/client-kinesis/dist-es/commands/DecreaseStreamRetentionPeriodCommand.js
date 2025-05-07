import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_DecreaseStreamRetentionPeriodCommand, se_DecreaseStreamRetentionPeriodCommand, } from "../protocols/Aws_json1_1";
export { $Command };
export class DecreaseStreamRetentionPeriodCommand extends $Command
    .classBuilder()
    .ep({
    ...commonParams,
    OperationType: { type: "staticContextParams", value: `control` },
    StreamARN: { type: "contextParams", name: "StreamARN" },
})
    .m(function (Command, cs, config, o) {
    return [
        getSerdePlugin(config, this.serialize, this.deserialize),
        getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("Kinesis_20131202", "DecreaseStreamRetentionPeriod", {})
    .n("KinesisClient", "DecreaseStreamRetentionPeriodCommand")
    .f(void 0, void 0)
    .ser(se_DecreaseStreamRetentionPeriodCommand)
    .de(de_DecreaseStreamRetentionPeriodCommand)
    .build() {
}
