import React from "react";

const TermsConditions = ({ isAcknowledged, setIsAcknowledged }) => {
  const handleCheckboxChange = () => {
    setIsAcknowledged(!isAcknowledged);
  };

  return (
    <div className="document-acknowledgment p-6">
      <h2 className="text-2xl font-bold mb-4">Review & Acknowledge Terms</h2>
      <p className="mb-4">
        Please read the following document carefully and acknowledge that you
        have understood its contents.
      </p>
      <a
        // href="/path-to-your-document.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View Document (PDF)
      </a>
      <div className="checkbox-container mt-4">
        <input
          type="checkbox"
          id="acknowledge"
          checked={isAcknowledged}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <label htmlFor="acknowledge" className="text-gray-700">
          I have read and understood the document
        </label>
      </div>
    </div>
  );
};

export default TermsConditions;
