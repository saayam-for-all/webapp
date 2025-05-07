import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_CreateStreamCommand, se_CreateStreamCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class CreateStreamCommand extends $Command
    .classBuilder()
    .ep({
    ...commonParams,
})
    .m(function (Command, cs, config, o) {
    return [
        getSerdePlugin(config, this.serialize, this.deserialize),
        getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("Kinesis_20131202", "CreateStream", {})
    .n("KinesisClient", "CreateStreamCommand")
    .f(void 0, void 0)
    .ser(se_CreateStreamCommand)
    .de(de_CreateStreamCommand)
    .build() {
}
