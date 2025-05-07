import { HttpRequest as __HttpRequest, HttpResponse as __HttpResponse } from "@smithy/protocol-http";
import { SerdeContext as __SerdeContext } from "@smithy/types";
import { PutActionInteractionsCommandInput, PutActionInteractionsCommandOutput } from "../commands/PutActionInteractionsCommand";
import { PutActionsCommandInput, PutActionsCommandOutput } from "../commands/PutActionsCommand";
import { PutEventsCommandInput, PutEventsCommandOutput } from "../commands/PutEventsCommand";
import { PutItemsCommandInput, PutItemsCommandOutput } from "../commands/PutItemsCommand";
import { PutUsersCommandInput, PutUsersCommandOutput } from "../commands/PutUsersCommand";
/**
 * serializeAws_restJson1PutActionInteractionsCommand
 */
export declare const se_PutActionInteractionsCommand: (input: PutActionInteractionsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
/**
 * serializeAws_restJson1PutActionsCommand
 */
export declare const se_PutActionsCommand: (input: PutActionsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
/**
 * serializeAws_restJson1PutEventsCommand
 */
export declare const se_PutEventsCommand: (input: PutEventsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
/**
 * serializeAws_restJson1PutItemsCommand
 */
export declare const se_PutItemsCommand: (input: PutItemsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
/**
 * serializeAws_restJson1PutUsersCommand
 */
export declare const se_PutUsersCommand: (input: PutUsersCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
/**
 * deserializeAws_restJson1PutActionInteractionsCommand
 */
export declare const de_PutActionInteractionsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PutActionInteractionsCommandOutput>;
/**
 * deserializeAws_restJson1PutActionsCommand
 */
export declare const de_PutActionsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PutActionsCommandOutput>;
/**
 * deserializeAws_restJson1PutEventsCommand
 */
export declare const de_PutEventsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PutEventsCommandOutput>;
/**
 * deserializeAws_restJson1PutItemsCommand
 */
export declare const de_PutItemsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PutItemsCommandOutput>;
/**
 * deserializeAws_restJson1PutUsersCommand
 */
export declare const de_PutUsersCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<PutUsersCommandOutput>;
