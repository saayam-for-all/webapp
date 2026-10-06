import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import Modal from "../../common/components/Modal/Modal";

const StewardVolunteerReview = () => {
  const location = useLocation();
  const volunteer = location.state || {};

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const userId = volunteer.userId || volunteer["User Id"];
  const applicantName =
    volunteer.name || volunteer.fullName || "Mock Applicant";
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
    </div>
  );
};

export default StewardVolunteerReview;
