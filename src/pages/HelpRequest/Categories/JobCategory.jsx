import React, { useState } from "react";
//import { FaTrash, FaTrashAlt } from 'react-icons/fa';

const JobsCategory = () => {
  const [userType, setUserType] = useState("jobSeeker"); // Default to job seeker
  const [resume, setResume] = useState(null);
  const [jobPreferences, setJobPreferences] = useState({
    jobTitle: "",
    location: "",
    jobType: "Full-time",
    salaryRange: "",
    relocate: "No",
  });
  const [skills, setSkills] = useState([
    { skill: "", level: "Beginner", experienceYears: "" },
  ]);
  const [availability, setAvailability] = useState({
    startDate: "",
    workHours: "Full-time",
  });
  const [hiringInfo, setHiringInfo] = useState({
    jobTitle: "",
    jobDescription: "",
    location: "",
    jobType: "Full-time",
    salaryRange: "",
    requiredSkills: "",
    requiredExperience: "",
    educationLevel: "Undergrad",
    urgency: "Immediate",
    specificDate: "",
  });

  const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResume(file ? file.name : null);
  };

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      { skill: "", level: "Beginner", experienceYears: "" },
    ]);
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleUrgencyChange = (e) => {
    setHiringInfo({ ...hiringInfo, urgency: e.target.value });
  };

  {
    /*const handleDateChange = (e) => {
    setHiringInfo({ ...hiringInfo, specificDate: e.target.value });
  };*/
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Are you a job seeker or hiring manager?
      </h2>
      <div className="flex space-x-4 mb-6">
        <label>
          <input
            type="radio"
            value="jobSeeker"
            checked={userType === "jobSeeker"}
            onChange={() => setUserType("jobSeeker")}
          />
          Job Seeker
        </label>
        <label>
          <input
            type="radio"
            value="hiringManager"
            checked={userType === "hiringManager"}
            onChange={() => setUserType("hiringManager")}
          />
          Hiring Manager
        </label>
      </div>

      {userType === "jobSeeker" && (
        <>
          {/* Job Seeker Fields */}
          <div className="mb-6">
            <h3 className="font-semibold">Upload Resume</h3>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ color: "blue" }}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold">Job Preferences</h3>
            <label>Desired Job Title/Position</label>
            <input
              type="text"
              value={jobPreferences.jobTitle}
              onChange={(e) =>
                setJobPreferences({
                  ...jobPreferences,
                  jobTitle: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />

            <label>Preferred Job Location</label>
            <input
              type="text"
              value={jobPreferences.location}
              onChange={(e) =>
                setJobPreferences({
                  ...jobPreferences,
                  location: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />

            <label>Preferred Job Type</label>
            <select
              value={jobPreferences.jobType}
              onChange={(e) =>
                setJobPreferences({
                  ...jobPreferences,
                  jobType: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>Expected Salary Range</label>
            <input
              type="text"
              value={jobPreferences.salaryRange}
              onChange={(e) =>
                setJobPreferences({
                  ...jobPreferences,
                  salaryRange: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />

            <label>Willingness to Relocate</label>
            <select
              value={jobPreferences.relocate}
              onChange={(e) =>
                setJobPreferences({
                  ...jobPreferences,
                  relocate: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {/* Skills Section */}
          <div className="mb-6">
            <h3 className="font-semibold">Skills & Experience</h3>
            {skills.map((skill, index) => (
              <div key={index} className="mb-4 relative">
                <label>Technical Skill</label>
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) =>
                    handleSkillChange(index, "skill", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />

                {/* Delete Icon */}
                {/*<FaTrashAlt
        onClick={() => handleDeleteSkill(index)}
        className="absolute right-0 top-0 cursor-pointer text-red-500"
        size={18}
      />*/}
                <label>Proficiency Level</label>
                <select
                  value={skill.level}
                  onChange={(e) =>
                    handleSkillChange(index, "level", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <label>Years of Experience</label>
                <input
                  type="text"
                  value={skill.experienceYears}
                  onChange={(e) =>
                    handleSkillChange(index, "experienceYears", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            {/*<button onClick={handleAddSkill} className="text-blue-500">
              Add another skill
            </button>*/}
          </div>

          {/* Availability Section */}
          <div className="mb-6">
            <h3 className="font-semibold">Availability</h3>
            <label>Available Start Date</label>
            <input
              type="date"
              value={availability.startDate}
              onChange={(e) =>
                setAvailability({ ...availability, startDate: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <label>Available Work Hours</label>
            <select
              value={availability.workHours}
              onChange={(e) =>
                setAvailability({ ...availability, workHours: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </>
      )}

      {userType === "hiringManager" && (
        <>
          {/* Hiring Manager Fields */}
          <div className="mb-6">
            <h3 className="font-semibold">Job Information</h3>
            <label>Job Title/Position</label>
            <input
              type="text"
              value={hiringInfo.jobTitle}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, jobTitle: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <label>Job Description</label>
            <textarea
              value={hiringInfo.jobDescription}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, jobDescription: e.target.value })
              }
              className="w-full p-2 border rounded"
            ></textarea>

            <label>Job Location</label>
            <input
              type="text"
              value={hiringInfo.location}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, location: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <label>Job Type</label>
            <select
              value={hiringInfo.jobType}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, jobType: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>Salary Range</label>
            <input
              type="text"
              value={hiringInfo.salaryRange}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, salaryRange: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Candidate Requirements */}
          <div className="mb-6">
            <h3 className="font-semibold">Candidate Requirements</h3>
            <label>Required Skills</label>
            <input
              type="text"
              value={hiringInfo.requiredSkills}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, requiredSkills: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <label>Required Years of Experience</label>
            <input
              type="text"
              value={hiringInfo.requiredExperience}
              onChange={(e) =>
                setHiringInfo({
                  ...hiringInfo,
                  requiredExperience: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />

            <label>Preferred Education Level</label>
            <select
              value={hiringInfo.educationLevel}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, educationLevel: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Undergrad">Undergrad</option>
              <option value="Grad">Grad</option>
            </select>
          </div>

          {/* Workplace Preferences */}
          <div className="mb-6">
            <h3 className="font-semibold">Workplace Preferences</h3>
            <label>Workplace Type</label>
            <select
              value={hiringInfo.workplaceType}
              onChange={(e) =>
                setHiringInfo({ ...hiringInfo, workplaceType: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Remote">Remote</option>
              <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Urgency of Hiring */}
          <div className="mb-6">
            <h3 className="font-semibold">Urgency of Hiring</h3>
            <select
              value={hiringInfo.urgency}
              onChange={handleUrgencyChange}
              className="w-full p-2 border rounded"
            >
              <option value="Immediate">Immediate</option>
              <option value="Specific date">Specific date</option>
            </select>

            {/* Conditionally show date picker when "Specific date" is selected */}
            {hiringInfo.urgency === "Specific date" && (
              <div className="mt-3">
                <label
                  htmlFor="specificDate"
                  className="block font-medium text-gray-700"
                >
                  Select a Date
                </label>
                <input
                  type="date"
                  id="specificDate"
                  value={hiringInfo.specificDate}
                  onChange={handleDateChange}
                  className="border p-2 w-full rounded-lg"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobsCategory;
