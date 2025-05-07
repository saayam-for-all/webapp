import { Paginator } from "@smithy/types";
import { ListStreamConsumersCommandInput, ListStreamConsumersCommandOutput } from "../commands/ListStreamConsumersCommand";
import { KinesisPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListStreamConsumers: (config: KinesisPaginationConfiguration, input: ListStreamConsumersCommandInput, ...rest: any[]) => Paginator<ListStreamConsumersCommandOutput>;
