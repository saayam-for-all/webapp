import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { OpenAuthSessionResult } from '../../../../utils/types';
import { DefaultOAuthStore } from '../../utils/signInWithRedirectStore';
import { TokenOrchestrator } from '../../tokenProvider';
export declare const handleOAuthSignOut: (cognitoConfig: CognitoUserPoolConfig, store: DefaultOAuthStore, tokenOrchestrator: TokenOrchestrator, redirectUrl: string | undefined) => Promise<void | OpenAuthSessionResult>;
