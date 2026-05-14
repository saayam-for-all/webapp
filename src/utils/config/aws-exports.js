// WARNING: DO NOT EDIT

const awsConfig = {
  Auth: {
    Cognito: {
      region: "auth.us-east-1",
      userPoolId: "us-east-1_hzvIMnDNi",
      userPoolClientId: "433qjfh10rhfb201cav0pdb8mk",
      loginWith: {
        email: true,
        oauth: {
          domain: "saayamforall-qauserpool.auth.us-east-1.amazoncognito.com",
          scopes: [
            "email",
            "profile",
            "openid",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: [
            "http://localhost:5173/dashboard",
            "https://idptest-saayam.netlify.app/dashboard",
          ],
          redirectSignOut: [
            "http://localhost:5173/login",
            "https://idptest-saayam.netlify.app/login",
          ],
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
