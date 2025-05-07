import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_ListStreamConsumersCommand, se_ListStreamConsumersCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class ListStreamConsumersCommand extends $Command
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
    .s("Kinesis_20131202", "ListStreamConsumers", {})
    .n("KinesisClient", "ListStreamConsumersCommand")
    .f(void 0, void 0)
    .ser(se_ListStreamConsumersCommand)
    .de(de_ListStreamConsumersCommand)
    .build() {
}
