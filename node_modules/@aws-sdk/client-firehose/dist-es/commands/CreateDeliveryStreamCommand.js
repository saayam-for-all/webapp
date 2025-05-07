import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { CreateDeliveryStreamInputFilterSensitiveLog, } from "../models/models_0";
import { de_CreateDeliveryStreamCommand, se_CreateDeliveryStreamCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class CreateDeliveryStreamCommand extends $Command
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
    .s("Firehose_20150804", "CreateDeliveryStream", {})
    .n("FirehoseClient", "CreateDeliveryStreamCommand")
    .f(CreateDeliveryStreamInputFilterSensitiveLog, void 0)
    .ser(se_CreateDeliveryStreamCommand)
    .de(de_CreateDeliveryStreamCommand)
    .build() {
}
