// src/authResponseHandler.js

import { CognitoAuth } from 'amazon-cognito-auth-js';
import { cognitoConfig } from './cognitoConfig';

const authData = {
  ClientId: cognitoConfig.ClientId,
  AppWebDomain: cognitoConfig.AppWebDomain,
  TokenScopesArray: cognitoConfig.TokenScopesArray,
  RedirectUriSignIn: cognitoConfig.RedirectUriSignIn,
  RedirectUriSignOut: cognitoConfig.RedirectUriSignOut,
  UserPoolId: cognitoConfig.UserPoolId,
};

const auth = new CognitoAuth(authData);

auth.userhandler = {
  onSuccess: function (result) {
    console.log("On Success result", result);
    window.location.href = '/dashboard';
  },
  onFailure: function (err) {
    console.error("On Failure result", err);
  }
};

const handleAuthResponse = () => {
  auth.parseCognitoWebResponse(window.location.href);
};

export { handleAuthResponse };
