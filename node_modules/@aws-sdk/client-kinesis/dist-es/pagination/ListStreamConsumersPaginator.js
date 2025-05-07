import { createPaginator } from "@smithy/core";
import { ListStreamConsumersCommand, } from "../commands/ListStreamConsumersCommand";
import { KinesisClient } from "../KinesisClient";
export const paginateListStreamConsumers = createPaginator(KinesisClient, ListStreamConsumersCommand, "NextToken", "NextToken", "MaxResults");
