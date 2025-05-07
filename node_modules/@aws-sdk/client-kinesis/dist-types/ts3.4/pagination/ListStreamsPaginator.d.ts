import { Paginator } from "@smithy/types";
import {
  ListStreamsCommandInput,
  ListStreamsCommandOutput,
} from "../commands/ListStreamsCommand";
import { KinesisPaginationConfiguration } from "./Interfaces";
export declare const paginateListStreams: (
  config: KinesisPaginationConfiguration,
  input: ListStreamsCommandInput,
  ...rest: any[]
) => Paginator<ListStreamsCommandOutput>;
