// WARNING: DO NOT EDIT

const awsConfig = {
  Auth: {
    Cognito: {
      identityPoolId: "us-east-1:d43f18d8-08e1-4444-8ad3-43eb18540540",
      region: "auth.us-east-1",
      userPoolId: "us-east-1_kbJhasUll",
      userPoolClientId: "58tqba3bjsk2v90kavksbqptrm",
      loginWith: {
        email: true,
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
