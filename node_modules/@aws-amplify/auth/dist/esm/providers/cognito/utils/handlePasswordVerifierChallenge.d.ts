import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { ClientMetadata } from '../types';
import { AuthTokenOrchestrator } from '../tokenProvider/types';
import { ChallengeParameters, RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { AuthenticationHelper } from './srp/AuthenticationHelper';
export declare function handlePasswordVerifierChallenge(password: string, challengeParameters: ChallengeParameters, clientMetadata: ClientMetadata | undefined, session: string | undefined, authenticationHelper: AuthenticationHelper, config: CognitoUserPoolConfig, tokenOrchestrator: AuthTokenOrchestrator): Promise<RespondToAuthChallengeCommandOutput>;
