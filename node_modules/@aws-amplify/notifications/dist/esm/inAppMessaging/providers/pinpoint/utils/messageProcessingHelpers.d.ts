import type { InAppMessageCampaign as PinpointInAppMessage } from '@aws-amplify/core/internals/aws-clients/pinpoint';
import { SessionState } from '@aws-amplify/core/internals/utils';
import { InAppMessage, InAppMessagingEvent } from '../../../types';
export declare function processInAppMessages(messages: PinpointInAppMessage[], event: InAppMessagingEvent): Promise<InAppMessage[]>;
export declare function sessionStateChangeHandler(state: SessionState): void;
export declare function incrementMessageCounts(messageId: string): Promise<void>;
