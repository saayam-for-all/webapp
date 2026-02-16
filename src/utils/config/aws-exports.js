// WARNING: DO NOT EDIT

const awsConfig = {
  Auth: {
    Cognito: {
      identityPoolId: "us-east-1:d43f18d8-08e1-4444-8ad3-43eb18540540",
      region: "auth.us-east-1",
      userPoolId: "us-east-1_rhpm7lZNw",
      userPoolClientId: "4vdh2ninjrbf48ufh8i91cukdj",
      loginWith: {
        email: true,
        oauth: {
          domain:
            "saayamforall-qauserpool-testv2.auth.us-east-1.amazoncognito.com",
          scopes: [
            "email",
            "profile",
            "openid",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: ["http://localhost:5173/dashboard"],
          redirectSignOut: ["http://localhost:5173/login"],
          responseType: "code",
        },
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
    },
  },
};

export default awsConfig;
