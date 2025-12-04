// test-data/login-data.js
import dotenv from 'dotenv';
dotenv.config();
export const loginTestData = {
    validCredentials: {
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD
    },
    invalidCredentials: {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }
  };