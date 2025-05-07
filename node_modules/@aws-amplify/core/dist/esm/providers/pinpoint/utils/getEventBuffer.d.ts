import { EventBufferConfig } from '../types/buffer';
import { AuthSession } from '../../../singleton/Auth/types';
import { PinpointEventBuffer } from './PinpointEventBuffer';
export type GetEventBufferInput = EventBufferConfig & {
    appId: string;
    region: string;
    credentials: Required<AuthSession>['credentials'];
    identityId?: AuthSession['identityId'];
    userAgentValue?: string;
};
/**
 * Returns a PinpointEventBuffer instance for the specified region & app ID, creating one if it does not yet exist.
 *
 * @internal
 */
export declare const getEventBuffer: ({ appId, region, credentials, bufferSize, flushInterval, flushSize, resendLimit, identityId, userAgentValue, }: GetEventBufferInput) => PinpointEventBuffer;
