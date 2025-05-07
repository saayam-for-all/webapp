import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { OpenAuthSessionResult } from '../../../../utils/types';
export declare const oAuthSignOutRedirect: (authConfig: CognitoUserPoolConfig, preferPrivateSession?: boolean, redirectUrl?: string) => Promise<void | OpenAuthSessionResult>;
