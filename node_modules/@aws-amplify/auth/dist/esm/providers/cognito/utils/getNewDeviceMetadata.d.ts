import { DeviceMetadata } from '../tokenProvider/types';
import { NewDeviceMetadataType } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
/**
 * This function is used to kick off the device management flow.
 *
 * If an error is thrown while generating a hash device or calling the `ConfirmDevice`
 * client, then this API will ignore the error and return undefined. Otherwise the authentication
 * flow will not complete and the user won't be able to be signed in.
 *
 * @returns DeviceMetadata | undefined
 */
export declare function getNewDeviceMetadata({ userPoolId, userPoolEndpoint, newDeviceMetadata, accessToken, }: {
    userPoolId: string;
    userPoolEndpoint: string | undefined;
    newDeviceMetadata?: NewDeviceMetadataType;
    accessToken?: string;
}): Promise<DeviceMetadata | undefined>;
