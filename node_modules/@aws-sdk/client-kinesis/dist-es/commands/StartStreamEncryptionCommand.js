import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_StartStreamEncryptionCommand, se_StartStreamEncryptionCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class StartStreamEncryptionCommand extends $Command
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
    .s("Kinesis_20131202", "StartStreamEncryption", {})
    .n("KinesisClient", "StartStreamEncryptionCommand")
    .f(void 0, void 0)
    .ser(se_StartStreamEncryptionCommand)
    .de(de_StartStreamEncryptionCommand)
    .build() {
}
