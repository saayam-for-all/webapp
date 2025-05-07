import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_StopDeliveryStreamEncryptionCommand, se_StopDeliveryStreamEncryptionCommand, } from "../protocols/Aws_json1_1";
export { $Command };
export class StopDeliveryStreamEncryptionCommand extends $Command
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
    .s("Firehose_20150804", "StopDeliveryStreamEncryption", {})
    .n("FirehoseClient", "StopDeliveryStreamEncryptionCommand")
    .f(void 0, void 0)
    .ser(se_StopDeliveryStreamEncryptionCommand)
    .de(de_StopDeliveryStreamEncryptionCommand)
    .build() {
}
