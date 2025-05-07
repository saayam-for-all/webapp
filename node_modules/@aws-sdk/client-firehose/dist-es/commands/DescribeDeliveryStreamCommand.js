import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { DescribeDeliveryStreamOutputFilterSensitiveLog, } from "../models/models_0";
import { de_DescribeDeliveryStreamCommand, se_DescribeDeliveryStreamCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class DescribeDeliveryStreamCommand extends $Command
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
    .s("Firehose_20150804", "DescribeDeliveryStream", {})
    .n("FirehoseClient", "DescribeDeliveryStreamCommand")
    .f(void 0, DescribeDeliveryStreamOutputFilterSensitiveLog)
    .ser(se_DescribeDeliveryStreamCommand)
    .de(de_DescribeDeliveryStreamCommand)
    .build() {
}
