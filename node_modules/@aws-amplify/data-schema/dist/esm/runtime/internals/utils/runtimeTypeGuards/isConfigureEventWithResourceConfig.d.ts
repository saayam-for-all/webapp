import { HubCapsule, ResourcesConfig } from '../../../bridge-types';
export declare function isConfigureEventWithResourceConfig(payload: HubCapsule<'core', {
    event: string;
    data?: unknown;
}>['payload']): payload is {
    event: 'configure';
    data: ResourcesConfig;
};
