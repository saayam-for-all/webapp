// WARNING: DO NOT EDIT

const awsConfig = {
  Auth: {
    Cognito: {
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
