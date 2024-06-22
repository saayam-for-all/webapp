// src/cognitoConfig.js

export const cognitoConfig = {
    UserPoolId: 'us-east-1_qRK2JytGV',
    ClientId: 'rauncvdl1vqs7p4c5o9vlmcd5',
    AppWebDomain: 'https://saayamforall.auth.us-east-1.amazoncognito.com',
    TokenScopesArray: ['openid', 'email', 'phone'],
    RedirectUriSignIn: 'https://test-saayam.netlify.app/dashboard', // URL to redirect to after sign in
    RedirectUriSignOut: 'https://test-saayam.netlify.app'
};