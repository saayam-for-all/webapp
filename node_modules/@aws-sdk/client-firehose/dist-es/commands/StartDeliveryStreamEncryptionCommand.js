import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { de_StartDeliveryStreamEncryptionCommand, se_StartDeliveryStreamEncryptionCommand, } from "../protocols/Aws_json1_1";
export { $Command };
export class StartDeliveryStreamEncryptionCommand extends $Command
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
    .s("Firehose_20150804", "StartDeliveryStreamEncryption", {})
    .n("FirehoseClient", "StartDeliveryStreamEncryptionCommand")
    .f(void 0, void 0)
    .ser(se_StartDeliveryStreamEncryptionCommand)
    .de(de_StartDeliveryStreamEncryptionCommand)
    .build() {
}
