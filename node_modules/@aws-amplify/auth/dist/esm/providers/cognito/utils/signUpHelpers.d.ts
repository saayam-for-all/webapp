import { SignInInput } from '../types';
import { AutoSignInCallback } from '../../../types/models';
export declare function handleCodeAutoSignIn(signInInput: SignInInput): void;
export declare function autoSignInWhenUserIsConfirmedWithLink(signInInput: SignInInput): AutoSignInCallback;
declare function autoSignInWithCode(signInInput: SignInInput): AutoSignInCallback;
export declare const autoSignInUserConfirmed: typeof autoSignInWithCode;
export {};
