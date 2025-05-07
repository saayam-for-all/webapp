import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { PutItemsRequestFilterSensitiveLog } from "../models/models_0";
import { de_PutItemsCommand, se_PutItemsCommand } from "../protocols/Aws_restJson1";
export { $Command };
export class PutItemsCommand extends $Command
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
    .s("AmazonPersonalizeEvents", "PutItems", {})
    .n("PersonalizeEventsClient", "PutItemsCommand")
    .f(PutItemsRequestFilterSensitiveLog, void 0)
    .ser(se_PutItemsCommand)
    .de(de_PutItemsCommand)
    .build() {
}
