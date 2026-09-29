import { useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

const StewardVolunteerReview = () => {
  const location = useLocation();
  const volunteer = location.state || {};

  const userId = volunteer.userId || volunteer["User Id"];
  const applicantName = volunteer.name || volunteer.fullName;
  const email = volunteer.email;
  const phone = volunteer.phone || volunteer.phoneNumber;
  const updatedTime = volunteer["Updated Time"] || volunteer.updatedAt;
  const skills = Array.isArray(volunteer.skills) ? volunteer.skills : [];
  const availability = Array.isArray(volunteer.availability)
    ? volunteer.availability
    : [];
  const govtIdFilename =
    volunteer.govtIdFilename || volunteer.governmentIdFilename;

  const formatAvailabilityTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <IoPersonCircle size={80} className="text-gray-400" />

          {applicantName && (
            <p className="text-lg font-semibold mt-2">{applicantName}</p>
          )}

          <p className="text-gray-500 text-sm mt-1">{userId || "N/A"}</p>

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
          <h2 className="text-lg font-semibold mb-3">Volunteer Application</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium w-36">Applicant Name:</span>
              <span>{applicantName || "N/A"}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-medium w-36">Applicant Email:</span>
              <span>{email || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium w-36">Phone Number:</span>
              <span>{phone || "N/A"}</span>

              {phone && (
                <>
                  <a
                    href={`tel:${phone}`}
                    aria-label="Call applicant"
                    className="text-gray-500"
                  >
                    <FaPhone size={14} />
                  </a>
                  <a
                    href={`https://wa.me/${String(phone).replace(/[^0-9]/g, "")}`}
                    aria-label="Message applicant on WhatsApp"
                    className="text-green-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp size={16} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Application Summary</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium w-36">Identification:</span>
              <span>{govtIdFilename ? "ID uploaded" : "Not available"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium w-36">Skills:</span>
              <span>
                {skills.length > 0
                  ? `${skills.length} selected`
                  : "Not available"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium w-36">Availability:</span>
              <span>
                {availability.length > 0
                  ? `${availability.length} time ${
                      availability.length === 1 ? "slot" : "slots"
                    } selected`
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Government ID</h2>
          <div className="text-sm text-gray-700">
            {govtIdFilename ? (
              <p>{govtIdFilename}</p>
            ) : (
              <p className="text-gray-500">
                Government ID information is not available.
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Volunteering Skills</h2>
          {skills.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {skills.map((skill, index) => (
                <li key={`${String(skill)}-${index}`}>
                  {typeof skill === "string"
                    ? skill
                    : skill.name || skill.label || JSON.stringify(skill)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Skill information is not available.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Availability</h2>
          {availability.length > 0 ? (
            <div className="text-sm text-gray-700 space-y-2">
              {availability.map((slot, index) => (
                <div key={`${slot.dayOfWeek || "slot"}-${index}`}>
                  <p className="font-medium">
                    {slot.dayOfWeek || `Slot ${index + 1}`}
                  </p>
                  {(slot.startTime || slot.endTime) && (
                    <p className="text-gray-500 ml-2">
                      {formatAvailabilityTime(slot.startTime)}
                      {slot.startTime && slot.endTime ? " - " : ""}
                      {formatAvailabilityTime(slot.endTime)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Availability information is not available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StewardVolunteerReview;
