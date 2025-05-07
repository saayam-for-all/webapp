import { ChallengeParameters } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { WebAuthnSignInResult } from './types';
export declare function handleWebAuthnSignInResult(challengeParameters: ChallengeParameters): Promise<WebAuthnSignInResult>;
