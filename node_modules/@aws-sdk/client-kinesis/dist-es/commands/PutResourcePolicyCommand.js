import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_PutResourcePolicyCommand, se_PutResourcePolicyCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class PutResourcePolicyCommand extends $Command
    .classBuilder()
    .ep({
    ...commonParams,
    OperationType: { type: "staticContextParams", value: `control` },
    ResourceARN: { type: "contextParams", name: "ResourceARN" },
})
    .m(function (Command, cs, config, o) {
    return [
        getSerdePlugin(config, this.serialize, this.deserialize),
        getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("Kinesis_20131202", "PutResourcePolicy", {})
    .n("KinesisClient", "PutResourcePolicyCommand")
    .f(void 0, void 0)
    .ser(se_PutResourcePolicyCommand)
    .de(de_PutResourcePolicyCommand)
    .build() {
}
