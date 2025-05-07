import { InAppMessageInteractionEvent } from '../inAppMessaging/types';
import { PushNotificationEvent } from '../pushNotifications/types';
export type EventListenerHandler = (...args: any[]) => unknown;
export interface EventListener<EventHandler extends EventListenerHandler> {
    handleEvent: EventHandler;
    remove(): void;
}
export type EventType = InAppMessageInteractionEvent | PushNotificationEvent;
export interface EventListenerRemover {
    remove(): void;
}
