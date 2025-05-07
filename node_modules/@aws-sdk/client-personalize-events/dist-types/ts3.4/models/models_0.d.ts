import {
  ExceptionOptionType as __ExceptionOptionType,
  LazyJsonString as __LazyJsonString,
} from "@smithy/smithy-client";
import { PersonalizeEventsServiceException as __BaseException } from "./PersonalizeEventsServiceException";
export interface Action {
  actionId: string | undefined;
  properties?: __LazyJsonString | string;
}
export interface ActionInteraction {
  actionId: string | undefined;
  userId?: string;
  sessionId: string | undefined;
  timestamp: Date | undefined;
  eventType: string | undefined;
  eventId?: string;
  recommendationId?: string;
  impression?: string[];
  properties?: __LazyJsonString | string;
}
export declare class InvalidInputException extends __BaseException {
  readonly name: "InvalidInputException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<InvalidInputException, __BaseException>
  );
}
export interface PutActionInteractionsRequest {
  trackingId: string | undefined;
  actionInteractions: ActionInteraction[] | undefined;
}
export declare class ResourceInUseException extends __BaseException {
  readonly name: "ResourceInUseException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<ResourceInUseException, __BaseException>
  );
}
export declare class ResourceNotFoundException extends __BaseException {
  readonly name: "ResourceNotFoundException";
  readonly $fault: "client";
  constructor(
    opts: __ExceptionOptionType<ResourceNotFoundException, __BaseException>
  );
}
export interface PutActionsRequest {
  datasetArn: string | undefined;
  actions: Action[] | undefined;
}
export interface MetricAttribution {
  eventAttributionSource: string | undefined;
}
export interface Event {
  eventId?: string;
  eventType: string | undefined;
  eventValue?: number;
  itemId?: string;
  properties?: __LazyJsonString | string;
  sentAt: Date | undefined;
  recommendationId?: string;
  impression?: string[];
  metricAttribution?: MetricAttribution;
}
export interface PutEventsRequest {
  trackingId: string | undefined;
  userId?: string;
  sessionId: string | undefined;
  eventList: Event[] | undefined;
}
export interface Item {
  itemId: string | undefined;
  properties?: __LazyJsonString | string;
}
export interface PutItemsRequest {
  datasetArn: string | undefined;
  items: Item[] | undefined;
}
export interface User {
  userId: string | undefined;
  properties?: __LazyJsonString | string;
}
export interface PutUsersRequest {
  datasetArn: string | undefined;
  users: User[] | undefined;
}
export declare const ActionFilterSensitiveLog: (obj: Action) => any;
export declare const ActionInteractionFilterSensitiveLog: (
  obj: ActionInteraction
) => any;
export declare const PutActionInteractionsRequestFilterSensitiveLog: (
  obj: PutActionInteractionsRequest
) => any;
export declare const PutActionsRequestFilterSensitiveLog: (
  obj: PutActionsRequest
) => any;
export declare const EventFilterSensitiveLog: (obj: Event) => any;
export declare const PutEventsRequestFilterSensitiveLog: (
  obj: PutEventsRequest
) => any;
export declare const ItemFilterSensitiveLog: (obj: Item) => any;
export declare const PutItemsRequestFilterSensitiveLog: (
  obj: PutItemsRequest
) => any;
export declare const UserFilterSensitiveLog: (obj: User) => any;
export declare const PutUsersRequestFilterSensitiveLog: (
  obj: PutUsersRequest
) => any;
