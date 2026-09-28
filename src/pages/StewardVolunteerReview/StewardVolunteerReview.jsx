import { useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

const StewardVolunteerReview = () => {
  const location = useLocation();
  const volunteer = location.state || {};

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <IoPersonCircle size={80} className="text-gray-400" />
          <p className="text-gray-500 text-sm mt-1">
            {volunteer["User Id"] || "SID-00-000-000-001"}
          </p>
          <p className="text-xs text-blue-400">Replace with applicant name</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
              PENDING APPROVAL
            </span>
            <span className="text-gray-400 text-xs">
              Submitted on: {volunteer["Updated Time"] || "N/A"}
            </span>
          </div>

          <button className="mt-2 text-sm text-blue-500 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50">
            View User Profile
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Reject
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Approve
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <button className="border border-blue-400 text-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-50">
            Request Information
          </button>
        </div>

        {/* Volunteer Application */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Volunteer Application</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium w-36">Applicant Name:</span>
              <span>{volunteer.name || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium w-36">Applicant Email:</span>
              <span>{volunteer.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium w-36">Phone Number:</span>
              <span>{volunteer.phone || "N/A"}</span>
              <FaPhone className="text-gray-500 cursor-pointer" size={14} />
              <FaWhatsapp className="text-green-500 cursor-pointer" size={16} />
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Application Summary</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium w-36">Identification:</span>
              <span>✓ ID uploaded</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium w-36">Skills:</span>
              <span>4 selected</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium w-36">Availability:</span>
              <span>4 time slots selected</span>
            </div>
          </div>
        </div>

        {/* Government ID */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Government ID</h2>
          <div className="text-sm text-gray-700">
            <div className="flex gap-2 mb-2">
              <span className="font-medium w-36">Identification:</span>
              <span>✓ ID uploaded</span>
            </div>
            <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
              ID Document
            </div>
          </div>
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
          </div>
        </div>

        {/* Availability */}
        <div>
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
    </div>
  );
};

export default StewardVolunteerReview;
