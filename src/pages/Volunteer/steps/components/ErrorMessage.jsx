import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return <p className="text-sm text-red-600 mb-4">{message}</p>;
};

export default ErrorMessage;