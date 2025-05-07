import { CognitoAuthSignInDetails } from '../../../providers/cognito/types';
import { ChallengeName } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
interface SignInState {
    username?: string;
    challengeName?: ChallengeName;
    signInSession?: string;
    signInDetails?: CognitoAuthSignInDetails;
}
type SignInAction = {
    type: 'SET_INITIAL_STATE';
} | {
    type: 'SET_SIGN_IN_STATE';
    value: SignInState;
} | {
    type: 'SET_USERNAME';
    value?: string;
} | {
    type: 'SET_CHALLENGE_NAME';
    value?: ChallengeName;
} | {
    type: 'SET_SIGN_IN_SESSION';
    value?: string;
} | {
    type: 'RESET_STATE';
};
export declare const resetActiveSignInState: () => void;
export declare const signInStore: {
    getState(): SignInState;
    dispatch(action: SignInAction): void;
};
export declare function setActiveSignInState(state: SignInState): void;
export declare const persistSignInState: ({ challengeName, signInSession, username, }: SignInState) => void;
export {};
