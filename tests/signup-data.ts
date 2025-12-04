//Added this line to generate random user emails as automation runs multiple times
/* Author: Divyasree */
const _uniqueSuffix = Math.floor(Math.random() * 900000) + 100000;

export const signupTestData  = {
  validUser: {
    firstName: 'Test',
    lastName: 'User',
    email: 'saayamqa@yahoo.com',
    phone: '4374893033',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  },
  SuccessfulUser: {
    firstName: 'Success',
    lastName: 'Username',
    email: `testuser${_uniqueSuffix}@example.com`,
    phone: '4374893037',
    password: 'Testnew@1234',
    confirmPassword: 'Testnew@1234',
  },
  invalidEmailUser: {
    firstName: 'Test',
    lastName: 'User',
    email: 'invalidemail',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  },
  passwordMismatchUser: {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${_uniqueSuffix}@example.com`,
    password: 'Test@1234',
    confirmPassword: 'Mismatch@1234',
  },
  weakPasswordUsers: [
    {
      firstName: 'User1',
      lastName: 'test1',
      email: 'user1@example.com',
      password: 'short',
      confirmPassword: 'short',
      fails: [
        "Password must contain at least 8 characters.",
        "Password must contain at least 1 number.",
        "Password must contain at least 1 special character.",
        "Password must contain at least 1 uppercase letter."
      ]
    },
    {
      firstName: 'User2',
      lastName: 'test2',
      email: 'user2@example.com',
      password: 'alllowercase',
      confirmPassword: 'alllowercase',
      fails: [
        "Password must contain at least 1 number.",
        "Password must contain at least 1 special character.",
        "Password must contain at least 1 uppercase letter."
      ]
    },
    {
      firstName: 'User3',
      lastName: 'test3',
      email: 'user3@example.com',
      password: 'ALLUPPERCASE1',
      confirmPassword: 'ALLUPPERCASE1',
      fails: [
        "Password must contain at least 1 special character.",
        "Password must contain at least 1 lowercase letter."
      ]
    },
    {
      firstName: 'User4',
      lastName: 'test4',
      email: 'user4@example.com',
      password: 'NoNumber!',
      confirmPassword: 'NoNumber!',
      fails: [
        "Password must contain at least 1 number."
      ]
    },
    {
      firstName: 'User5',
      lastName: 'test5',
      email: 'user5@example.com',
      password: 'NoSpecial1',
      confirmPassword: 'NoSpecial1',
      fails: [
        "Password must contain at least 1 special character."
      ]
    }
  ],
  passwordRules: [
    "Password must contain at least 8 characters.",
    "Password must contain at least 1 number.",
    "Password must contain at least 1 special character.",
    "Password must contain at least 1 uppercase letter.",
    "Password must contain at least 1 lowercase letter."
  ]
};