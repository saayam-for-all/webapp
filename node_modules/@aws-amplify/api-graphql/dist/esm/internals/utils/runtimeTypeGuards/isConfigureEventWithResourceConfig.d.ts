import { HubCapsule, ResourcesConfig } from '@aws-amplify/core';
export declare function isConfigureEventWithResourceConfig(payload: HubCapsule<'core', {
    event: string;
    data?: unknown;
}>['payload']): payload is {
    event: 'configure';
    data: ResourcesConfig;
};
