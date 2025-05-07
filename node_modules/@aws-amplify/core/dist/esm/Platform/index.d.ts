import { UserAgent as AWSUserAgent } from '@aws-sdk/types';
import { CustomUserAgentDetails, Framework } from './types';
/** Sanitize Amplify version string be removing special character + and character post the special character  */
export declare const sanitizeAmplifyVersion: (amplifyVersion: string) => string;
declare class PlatformBuilder {
    userAgent: string;
    get framework(): Framework;
    get isReactNative(): boolean;
    observeFrameworkChanges(fcn: () => void): void;
}
export declare const Platform: PlatformBuilder;
export declare const getAmplifyUserAgentObject: ({ category, action, }?: CustomUserAgentDetails) => AWSUserAgent;
export declare const getAmplifyUserAgent: (customUserAgentDetails?: CustomUserAgentDetails) => string;
export {};
