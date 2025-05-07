import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { ClientMetadata } from '../types';
import { AuthTokenOrchestrator } from '../tokenProvider/types';
import { RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
interface HandleDeviceSRPInput {
    username: string;
    config: CognitoUserPoolConfig;
    clientMetadata: ClientMetadata | undefined;
    session: string | undefined;
    tokenOrchestrator?: AuthTokenOrchestrator;
}
export declare function handleDeviceSRPAuth({ username, config, clientMetadata, session, tokenOrchestrator, }: HandleDeviceSRPInput): Promise<RespondToAuthChallengeCommandOutput>;
export {};
