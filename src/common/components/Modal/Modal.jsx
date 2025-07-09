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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Scrollable content area */}
        <div className="overflow-y-auto p-6 flex-1">{children}</div>

        {/* Fixed footer with Close button */}
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
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
