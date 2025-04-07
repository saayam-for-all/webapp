import React from "react";

const Modal = ({
  show,
  onClose,
  onSubmit,
  submitText = "Submit",
  children,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        {children}

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-1 text-sm rounded hover:bg-gray-500 transition"
          >
            Close
          </button>

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
            >
              {submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
