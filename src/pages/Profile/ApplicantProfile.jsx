import { Link, useLocation } from "react-router-dom";
const ApplicantProfile = () => {
  const location = useLocation();
  const applicant = location.state?.applicant;

  if (!applicant) {
    return (
      <div className="mx-auto my-10 max-w-xl px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-600">Applicant information is unavailable.</p>

          <Link
            to="/dashboard?view=steward"
            className="mt-5 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Steward Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-2xl px-4">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {applicant.name || "Applicant Profile"}
        </h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Name: </span>
            <span>{applicant.name || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Email: </span>
            <span>{applicant.email || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Phone: </span>
            <span>{applicant.phone || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Location: </span>
            <span>{applicant.location || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Interested Cause: </span>
            <span>{applicant.cause || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Rating: </span>
            <span>{applicant.rating || "Not available"}</span>
          </div>

          <div>
            <span className="font-semibold">Date Added: </span>
            <span>{applicant.dateAdded || "Not available"}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/dashboard?view=steward"
            className="inline-block rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to Steward Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
