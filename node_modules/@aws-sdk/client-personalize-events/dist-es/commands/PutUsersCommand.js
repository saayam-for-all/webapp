import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { PutUsersRequestFilterSensitiveLog } from "../models/models_0";
import { de_PutUsersCommand, se_PutUsersCommand } from "../protocols/Aws_restJson1";
export { $Command };
export class PutUsersCommand extends $Command
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
    .s("AmazonPersonalizeEvents", "PutUsers", {})
    .n("PersonalizeEventsClient", "PutUsersCommand")
    .f(PutUsersRequestFilterSensitiveLog, void 0)
    .ser(se_PutUsersCommand)
    .de(de_PutUsersCommand)
    .build() {
}
