import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { UpdateDestinationInputFilterSensitiveLog, } from "../models/models_0";
import { de_UpdateDestinationCommand, se_UpdateDestinationCommand } from "../protocols/Aws_json1_1";
export { $Command };
export class UpdateDestinationCommand extends $Command
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
    .s("Firehose_20150804", "UpdateDestination", {})
    .n("FirehoseClient", "UpdateDestinationCommand")
    .f(UpdateDestinationInputFilterSensitiveLog, void 0)
    .ser(se_UpdateDestinationCommand)
    .de(de_UpdateDestinationCommand)
    .build() {
}
