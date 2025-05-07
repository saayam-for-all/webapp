import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_StopStreamEncryptionCommand, se_StopStreamEncryptionCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class StopStreamEncryptionCommand extends $Command
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
    .s("Kinesis_20131202", "StopStreamEncryption", {})
    .n("KinesisClient", "StopStreamEncryptionCommand")
    .f(void 0, void 0)
    .ser(se_StopStreamEncryptionCommand)
    .de(de_StopStreamEncryptionCommand)
    .build() {
}
