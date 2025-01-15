import React from "react";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" data-testid='divOne'>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full" data-testid = 'divTwo'>
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-500" 
          data-testid = 'buttonOne'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
