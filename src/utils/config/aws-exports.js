// WARNING: DO NOT EDIT

const awsConfig = {
  Auth: {
    Cognito: {
      identityPoolId: "us-east-1:d43f18d8-08e1-4444-8ad3-43eb18540540",
      region: "auth.us-east-1",
      userPoolId: "us-east-1_qRK2JytGV",
      userPoolClientId: "rauncvdl1vqs7p4c5o9vlmcd5",
      loginWith: {
        oauth: {
          domain: "saayamforall.auth.us-east-1.amazoncognito.com",
          scopes: ["phone", "email", "openid"],
          // redirectSignIn: ["http://localhost:5173/dashboard"],
          // redirectSignOut: ["http://localhost:5173"],
          redirectSignIn: ["https://test-saayam.netlify.app/dashboard"],
          redirectSignOut: ["https://test-saayam.netlify.app"],
          responseType: "code",
        },
      },
    },
  },
};

export default awsConfig;
