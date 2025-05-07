import { createPaginator } from "@smithy/core";
import { ListStreamsCommand } from "../commands/ListStreamsCommand";
import { KinesisClient } from "../KinesisClient";
export const paginateListStreams = createPaginator(KinesisClient, ListStreamsCommand, "NextToken", "NextToken", "Limit");
