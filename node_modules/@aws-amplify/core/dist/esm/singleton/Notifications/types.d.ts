import { AtLeastOne } from '../types';
import { InAppMessagingConfig } from './InAppMessaging/types';
import { PushNotificationConfig } from './PushNotification/types';
export interface InAppMessagingProviderConfig {
    InAppMessaging: InAppMessagingConfig;
}
export interface PushNotificationProviderConfig {
    PushNotification: PushNotificationConfig;
}
export type NotificationsConfig = AtLeastOne<InAppMessagingProviderConfig & PushNotificationProviderConfig>;
