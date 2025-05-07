import { ChallengeName, ChallengeParameters } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { AuthSignInOutput } from '../../../types';
export type WebAuthnSignInResult = AuthSignInOutput | {
    challengeName: ChallengeName;
    challengeParameters: ChallengeParameters;
};
