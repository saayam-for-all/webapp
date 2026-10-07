import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import Modal from "../../common/components/Modal/Modal";

const StewardVolunteerReview = () => {
  const location = useLocation();
  const volunteer = location.state || {};

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const userId = volunteer.userId || volunteer["User Id"];
  const applicantName = volunteer.name || volunteer.fullName || "Jane Doe";
  const updatedTime = volunteer["Updated Time"] || volunteer.updatedAt;
  const govtIdFilename =
    volunteer.govtIdFilename ||
    volunteer.governmentIdFilename ||
    "government-id.pdf";

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) return;

    // TODO: Persist the rejection reason when the API is available.
    handleCloseRejectModal();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <IoPersonCircle size={80} className="text-gray-400" />

          <p className="text-gray-500 text-sm mt-2">
            UserId: {userId || "N/A"}
          </p>

          <Link
            to="/profile"
            className="text-blue-500 hover:underline font-semibold mt-1"
          >
            {applicantName}
          </Link>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
              PENDING APPROVAL
            </span>
            <span className="text-gray-400 text-xs">
              Submitted on: {updatedTime || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={handleReject}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Reject
          </button>

          <button
            type="button"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Promote
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="border border-blue-400 text-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
            onClick={() => setShowRequestModal(true)}
          >
            Request More Information
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Government ID</h2>

          <a
            href="data:text/plain;charset=utf-8,Mock%20government%20ID%20document"
            download={govtIdFilename}
            className="text-sm text-blue-500 hover:underline"
          >
            {govtIdFilename}
          </a>
        </div>
        {/* Volunteering Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Volunteering Skills</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <p className="font-medium">▶ Clothing Assistance</p>
              <p className="ml-4 text-gray-500">• Donate Clothes</p>
            </div>
            <div>
              <p className="font-medium">▶ Elderly Community Assistance</p>
              <p className="ml-4 text-gray-500">• Medication Management</p>
            </div>
            <div>
              <p className="font-medium">▶ Education & Career Support</p>
              <p className="ml-4 text-gray-500">• Tutoring</p>
              <p className="ml-8 text-gray-400">• Mathematics</p>
              <p className="ml-8 text-gray-400">• Science</p>
            </div>
            <div>
              <p className="font-medium">▶ Healthcare & Wellness</p>
              <p className="ml-4 text-gray-500">• Medical Consultation</p>
              <p className="ml-4 text-gray-500">• Skin / Dermatology</p>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Availability{" "}
            <span className="text-sm font-normal text-gray-500">
              4 slots selected
            </span>
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <p className="font-medium">Monday</p>
              <p className="text-gray-500 ml-2">9:30AM - 12:00PM</p>
              <p className="text-gray-500 ml-2">4:00PM - 7:00PM</p>
            </div>
            <div>
              <p className="font-medium">Wednesday</p>
              <p className="text-gray-500 ml-2">12:00PM - 5:00PM</p>
            </div>
            <div>
              <p className="font-medium">Saturday</p>
              <p className="text-gray-500 ml-2">10:00AM - 1:00PM</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showRejectModal}
        onClose={handleCloseRejectModal}
        onSubmit={handleRejectSubmit}
        submitText="Reject"
      >
        <h2 className="text-lg font-semibold mb-4">Reject Volunteer</h2>

        <label
          htmlFor="rejection-reason"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Reason for rejection
        </label>

        <textarea
          id="rejection-reason"
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3"
          placeholder="Enter reason for rejection"
          required
        />
      </Modal>
      {/* Request Information Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Request Information</h2>
            <textarea
              className="w-full border rounded p-2 text-sm h-28 resize-none"
              placeholder="Enter your message..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-gray-500 border rounded hover:bg-gray-50"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  console.log("Request message:", requestMessage);
                  setShowRequestModal(false);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StewardVolunteerReview;
