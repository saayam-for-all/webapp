import { EventBuffer } from '../../../utils';
import { PersonalizeBufferEvent, PersonalizeEvent } from '../types';
interface MediaAutoTrackConfig {
    trackingId: string;
    sessionId: string;
    userId?: string;
    event: PersonalizeEvent;
}
export declare const autoTrackMedia: (config: MediaAutoTrackConfig, eventBuffer: EventBuffer<PersonalizeBufferEvent>) => Promise<void>;
export {};
