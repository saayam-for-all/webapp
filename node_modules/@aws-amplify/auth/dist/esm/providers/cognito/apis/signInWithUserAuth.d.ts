import { SignInWithUserAuthInput, SignInWithUserAuthOutput } from '../types';
/**
 * Signs a user in through a registered email or phone number without a password by by receiving and entering an OTP.
 *
 * @param input - The SignInWithUserAuthInput object
 * @returns SignInWithUserAuthOutput
 * @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito service errors
 * thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password -- needs to change
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
export declare function signInWithUserAuth(input: SignInWithUserAuthInput): Promise<SignInWithUserAuthOutput>;
