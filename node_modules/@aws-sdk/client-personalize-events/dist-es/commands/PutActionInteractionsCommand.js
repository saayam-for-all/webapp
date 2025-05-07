import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { PutActionInteractionsRequestFilterSensitiveLog } from "../models/models_0";
import { de_PutActionInteractionsCommand, se_PutActionInteractionsCommand } from "../protocols/Aws_restJson1";
export { $Command };
export class PutActionInteractionsCommand extends $Command
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
    .s("AmazonPersonalizeEvents", "PutActionInteractions", {})
    .n("PersonalizeEventsClient", "PutActionInteractionsCommand")
    .f(PutActionInteractionsRequestFilterSensitiveLog, void 0)
    .ser(se_PutActionInteractionsCommand)
    .de(de_PutActionInteractionsCommand)
    .build() {
}
