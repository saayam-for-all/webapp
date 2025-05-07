import { createAggregatedClient } from "@smithy/smithy-client";
import { PutActionInteractionsCommand, } from "./commands/PutActionInteractionsCommand";
import { PutActionsCommand } from "./commands/PutActionsCommand";
import { PutEventsCommand } from "./commands/PutEventsCommand";
import { PutItemsCommand } from "./commands/PutItemsCommand";
import { PutUsersCommand } from "./commands/PutUsersCommand";
import { PersonalizeEventsClient } from "./PersonalizeEventsClient";
const commands = {
    PutActionInteractionsCommand,
    PutActionsCommand,
    PutEventsCommand,
    PutItemsCommand,
    PutUsersCommand,
};
export class PersonalizeEvents extends PersonalizeEventsClient {
}
createAggregatedClient(commands, PersonalizeEvents);
