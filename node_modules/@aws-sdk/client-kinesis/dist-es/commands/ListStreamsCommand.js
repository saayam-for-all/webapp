import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_ListStreamsCommand, se_ListStreamsCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class ListStreamsCommand extends $Command
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
    .s("Kinesis_20131202", "ListStreams", {})
    .n("KinesisClient", "ListStreamsCommand")
    .f(void 0, void 0)
    .ser(se_ListStreamsCommand)
    .de(de_ListStreamsCommand)
    .build() {
}
