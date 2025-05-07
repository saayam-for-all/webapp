import { CognitoAuthSignInDetails } from '../types';
import { AuthenticationResultType } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { DeviceMetadata } from './types';
export declare function cacheCognitoTokens(AuthenticationResult: AuthenticationResultType & {
    NewDeviceMetadata?: DeviceMetadata;
    username: string;
    signInDetails?: CognitoAuthSignInDetails;
}): Promise<void>;
