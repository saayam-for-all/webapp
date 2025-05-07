import { HttpHandlerOptions as __HttpHandlerOptions } from "@smithy/types";
import {
  PutActionInteractionsCommandInput,
  PutActionInteractionsCommandOutput,
} from "./commands/PutActionInteractionsCommand";
import {
  PutActionsCommandInput,
  PutActionsCommandOutput,
} from "./commands/PutActionsCommand";
import {
  PutEventsCommandInput,
  PutEventsCommandOutput,
} from "./commands/PutEventsCommand";
import {
  PutItemsCommandInput,
  PutItemsCommandOutput,
} from "./commands/PutItemsCommand";
import {
  PutUsersCommandInput,
  PutUsersCommandOutput,
} from "./commands/PutUsersCommand";
import { PersonalizeEventsClient } from "./PersonalizeEventsClient";
export interface PersonalizeEvents {
  putActionInteractions(
    args: PutActionInteractionsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutActionInteractionsCommandOutput>;
  putActionInteractions(
    args: PutActionInteractionsCommandInput,
    cb: (err: any, data?: PutActionInteractionsCommandOutput) => void
  ): void;
  putActionInteractions(
    args: PutActionInteractionsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutActionInteractionsCommandOutput) => void
  ): void;
  putActions(
    args: PutActionsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutActionsCommandOutput>;
  putActions(
    args: PutActionsCommandInput,
    cb: (err: any, data?: PutActionsCommandOutput) => void
  ): void;
  putActions(
    args: PutActionsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutActionsCommandOutput) => void
  ): void;
  putEvents(
    args: PutEventsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutEventsCommandOutput>;
  putEvents(
    args: PutEventsCommandInput,
    cb: (err: any, data?: PutEventsCommandOutput) => void
  ): void;
  putEvents(
    args: PutEventsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutEventsCommandOutput) => void
  ): void;
  putItems(
    args: PutItemsCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutItemsCommandOutput>;
  putItems(
    args: PutItemsCommandInput,
    cb: (err: any, data?: PutItemsCommandOutput) => void
  ): void;
  putItems(
    args: PutItemsCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutItemsCommandOutput) => void
  ): void;
  putUsers(
    args: PutUsersCommandInput,
    options?: __HttpHandlerOptions
  ): Promise<PutUsersCommandOutput>;
  putUsers(
    args: PutUsersCommandInput,
    cb: (err: any, data?: PutUsersCommandOutput) => void
  ): void;
  putUsers(
    args: PutUsersCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: PutUsersCommandOutput) => void
  ): void;
}
export declare class PersonalizeEvents
  extends PersonalizeEventsClient
  implements PersonalizeEvents {}
