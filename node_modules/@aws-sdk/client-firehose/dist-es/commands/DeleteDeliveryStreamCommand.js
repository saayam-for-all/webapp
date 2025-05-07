import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_DeleteDeliveryStreamCommand, se_DeleteDeliveryStreamCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class DeleteDeliveryStreamCommand extends $Command
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
    .s("Firehose_20150804", "DeleteDeliveryStream", {})
    .n("FirehoseClient", "DeleteDeliveryStreamCommand")
    .f(void 0, void 0)
    .ser(se_DeleteDeliveryStreamCommand)
    .de(de_DeleteDeliveryStreamCommand)
    .build() {
}
