import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_PutRecordBatchCommand, se_PutRecordBatchCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class PutRecordBatchCommand extends $Command
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
    .s("Firehose_20150804", "PutRecordBatch", {})
    .n("FirehoseClient", "PutRecordBatchCommand")
    .f(void 0, void 0)
    .ser(se_PutRecordBatchCommand)
    .de(de_PutRecordBatchCommand)
    .build() {
}
