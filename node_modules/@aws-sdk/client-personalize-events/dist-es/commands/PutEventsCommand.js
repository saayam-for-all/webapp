import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { PutEventsRequestFilterSensitiveLog } from "../models/models_0";
import { de_PutEventsCommand, se_PutEventsCommand } from "../protocols/Aws_restJson1";
export { $Command };
export class PutEventsCommand extends $Command
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
    .s("AmazonPersonalizeEvents", "PutEvents", {})
    .n("PersonalizeEventsClient", "PutEventsCommand")
    .f(PutEventsRequestFilterSensitiveLog, void 0)
    .ser(se_PutEventsCommand)
    .de(de_PutEventsCommand)
    .build() {
}
