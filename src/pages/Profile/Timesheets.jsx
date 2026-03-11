import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FiClock, FiCheck, FiX, FiEdit2, FiAlertCircle } from "react-icons/fi";
import LoadingIndicator from "../../common/components/Loading/Loading";
import {
  getTimesheets,
  getTimesheet,
  submitTimesheet,
  updateTimesheet,
} from "../../services/timesheetServices";

// Helper to get the Monday of the current week
const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper to get the Sunday of the current week
const getWeekEnd = (date = new Date()) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

// Format date as YYYY-MM-DD
const formatDateISO = (date) => {
  return date.toISOString().split("T")[0];
};

// Format date for display
const formatDateDisplay = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Role options for timesheet
const PROJECT_OPTIONS = [
  { value: "", label: "Select a role" },
  { value: "full_stack_developer", label: "Full Stack Developer" },
  { value: "product_manager", label: "Product Manager" },
  { value: "project_manager", label: "Project Manager" },
  { value: "sdet", label: "SDET" },
  { value: "devsecops", label: "DevSecOps" },
  { value: "business_analyst", label: "Business Analyst" },
  { value: "data_engineer", label: "Data Engineer" },
  { value: "ai_ml_engineer", label: "AI/ML Engineer" },
  { value: "other", label: "Other" },
];

const Timesheets = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation("profile");
  const userDbId = useSelector((state) => state.auth.user?.userDbId);

  // Form state
  const [formData, setFormData] = useState({
    hoursWorked: "",
    project: "",
    gitIssueUrl: "",
    description: "",
    confirmed: false,
  });
  const [formErrors, setFormErrors] = useState({});

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Data state
  const [currentWeekTimesheet, setCurrentWeekTimesheet] = useState(null);
  const [timesheetHistory, setTimesheetHistory] = useState([]);

  // Current week period
  const currentWeekStart = useMemo(() => getWeekStart(), []);
  const currentWeekEnd = useMemo(() => getWeekEnd(), []);

  // Check if current timesheet is editable
  const isEditable = useMemo(() => {
    if (!currentWeekTimesheet) return true; // New submission
    if (!currentWeekTimesheet.editableUntil) return false;
    return new Date() < new Date(currentWeekTimesheet.editableUntil);
  }, [currentWeekTimesheet]);

  // Fetch timesheets on mount
  useEffect(() => {
    fetchTimesheets();
  }, [userDbId]);

  const fetchTimesheets = async () => {
    if (!userDbId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getTimesheets({
        volunteerId: userDbId,
      });

      const timesheets = response?.body || response || [];

      // Find current week's timesheet
      const currentWeek = timesheets.find(
        (ts) => ts.weekStart === formatDateISO(currentWeekStart),
      );

      if (currentWeek) {
        setCurrentWeekTimesheet(currentWeek);
        setFormData({
          hoursWorked: currentWeek.hoursWorked?.toString() || "",
          project: currentWeek.project || "",
          gitIssueUrl: currentWeek.gitIssueUrl || "",
          description: currentWeek.description || "",
          confirmed: true,
        });
      }

      // Set history (all timesheets sorted by date descending)
      setTimesheetHistory(
        timesheets
          .filter((ts) => ts.weekStart !== formatDateISO(currentWeekStart))
          .sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart)),
      );
    } catch (err) {
      console.error("Error fetching timesheets:", err);
      setError(t("TIMESHEET_FETCH_ERROR") || "Failed to load timesheets.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const allTimesheets = currentWeekTimesheet
      ? [currentWeekTimesheet, ...timesheetHistory]
      : timesheetHistory;

    const thisMonthTimesheets = allTimesheets.filter((ts) => {
      const tsDate = new Date(ts.weekStart);
      return (
        tsDate.getMonth() === currentMonth &&
        tsDate.getFullYear() === currentYear
      );
    });

    const totalHoursThisMonth = thisMonthTimesheets.reduce(
      (sum, ts) => sum + (parseFloat(ts.hoursWorked) || 0),
      0,
    );

    const approvedHours = thisMonthTimesheets
      .filter((ts) => ts.status === "approved")
      .reduce((sum, ts) => sum + (parseFloat(ts.hoursWorked) || 0), 0);

    const submissionCount = allTimesheets.length;

    return {
      totalHoursThisMonth: totalHoursThisMonth.toFixed(1),
      approvedHours: approvedHours.toFixed(1),
      submissionCount,
    };
  }, [currentWeekTimesheet, timesheetHistory]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.hoursWorked || parseFloat(formData.hoursWorked) <= 0) {
      errors.hoursWorked =
        t("TIMESHEET_HOURS_REQUIRED") || "Hours worked is required";
    } else if (parseFloat(formData.hoursWorked) > 168) {
      errors.hoursWorked =
        t("TIMESHEET_HOURS_MAX") || "Hours cannot exceed 168 per week";
    }

    if (!formData.project) {
      errors.project =
        t("TIMESHEET_PROJECT_REQUIRED") || "Project/Team is required";
    }

    if (!formData.gitIssueUrl) {
      errors.gitIssueUrl =
        t("TIMESHEET_GIT_URL_REQUIRED") || "Git Issue URL is required";
    } else if (
      !formData.gitIssueUrl.match(
        /^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org|dev\.azure\.com)/i,
      )
    ) {
      errors.gitIssueUrl =
        t("TIMESHEET_GIT_URL_INVALID") ||
        "Please enter a valid Git issue URL (GitHub, GitLab, Bitbucket, or Azure DevOps)";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description =
        t("TIMESHEET_DESCRIPTION_REQUIRED") ||
        "Description is required (minimum 10 characters)";
    }

    if (!formData.confirmed) {
      errors.confirmed =
        t("TIMESHEET_CONFIRMATION_REQUIRED") ||
        "Please confirm the accuracy of your timesheet";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      const payload = {
        volunteerId: userDbId,
        weekStart: formatDateISO(currentWeekStart),
        weekEnd: formatDateISO(currentWeekEnd),
        hoursWorked: parseFloat(formData.hoursWorked),
        project: formData.project,
        gitIssueUrl: formData.gitIssueUrl,
        description: formData.description,
      };

      let response;
      if (currentWeekTimesheet?.id) {
        response = await updateTimesheet(currentWeekTimesheet.id, payload);
        setSuccessMessage(
          t("TIMESHEET_UPDATE_SUCCESS") || "Timesheet updated successfully!",
        );
      } else {
        response = await submitTimesheet(payload);
        setSuccessMessage(
          t("TIMESHEET_SUBMIT_SUCCESS") || "Timesheet submitted successfully!",
        );
      }

      // Refresh data
      await fetchTimesheets();
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error submitting timesheet:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("TIMESHEET_SUBMIT_ERROR") ||
        "Failed to submit timesheet.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    if (currentWeekTimesheet) {
      setFormData({
        hoursWorked: currentWeekTimesheet.hoursWorked?.toString() || "",
        project: currentWeekTimesheet.project || "",
        gitIssueUrl: currentWeekTimesheet.gitIssueUrl || "",
        description: currentWeekTimesheet.description || "",
        confirmed: true,
      });
    } else {
      setFormData({
        hoursWorked: "",
        project: "",
        gitIssueUrl: "",
        description: "",
        confirmed: false,
      });
    }
    setFormErrors({});
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: FiClock,
        label: t("STATUS_PENDING") || "Pending",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: FiCheck,
        label: t("STATUS_APPROVED") || "Approved",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: FiX,
        label: t("STATUS_REJECTED") || "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("TIMESHEETS") || "Timesheets"}
        </h2>
        <p className="text-sm text-gray-500">
          {t("TIMESHEETS_DESCRIPTION") ||
            "Track and submit your volunteer hours"}
        </p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">
            {t("TOTAL_HOURS_THIS_MONTH") || "Total Hours This Month"}
          </p>
          <p className="text-2xl font-bold text-blue-800">
            {summaryStats.totalHoursThisMonth}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">
            {t("APPROVED_HOURS") || "Approved Hours"}
          </p>
          <p className="text-2xl font-bold text-green-800">
            {summaryStats.approvedHours}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">
            {t("TOTAL_SUBMISSIONS") || "Total Submissions"}
          </p>
          <p className="text-2xl font-bold text-purple-800">
            {summaryStats.submissionCount}
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Current Week Timesheet Form/View */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t("CURRENT_WEEK_TIMESHEET") || "Current Week Timesheet"}
              </h3>
              <p className="text-orange-100 text-sm">
                {formatDateDisplay(currentWeekStart)} —{" "}
                {formatDateDisplay(currentWeekEnd)}
              </p>
            </div>
            {currentWeekTimesheet && (
              <StatusBadge status={currentWeekTimesheet.status} />
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Editable deadline notice */}
          {currentWeekTimesheet?.editableUntil && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                isEditable
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              {isEditable ? (
                <>
                  <FiClock className="inline-block w-4 h-4 mr-2" />
                  {t("EDITABLE_UNTIL") || "Editable until"}:{" "}
                  {formatDateDisplay(currentWeekTimesheet.editableUntil)}
                </>
              ) : (
                <>
                  <FiAlertCircle className="inline-block w-4 h-4 mr-2" />
                  {t("EDIT_WINDOW_CLOSED") ||
                    "Edit window has closed. This timesheet is now read-only."}
                </>
              )}
            </div>
          )}

          {/* Form or Read-only View */}
          {isEditing || (!currentWeekTimesheet && isEditable) ? (
            // Editable Form
            <div className="space-y-5">
              {/* Hours Worked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("HOURS_WORKED") || "Hours Worked"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="168"
                  step="0.5"
                  value={formData.hoursWorked}
                  onChange={(e) =>
                    handleFieldChange("hoursWorked", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.hoursWorked
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., 8.5"
                />
                {formErrors.hoursWorked && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.hoursWorked}
                  </p>
                )}
              </div>

              {/* Project/Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("PROJECT_TEAM") || "Project/Team"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => handleFieldChange("project", e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.project
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  {PROJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formErrors.project && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.project}
                  </p>
                )}
              </div>

              {/* Git Issue URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("GIT_ISSUE_URL") || "Git Issue URL"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.gitIssueUrl}
                  onChange={(e) =>
                    handleFieldChange("gitIssueUrl", e.target.value)
                  }
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.gitIssueUrl
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="https://github.com/org/repo/issues/123"
                />
                {formErrors.gitIssueUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.gitIssueUrl}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("DESCRIPTION") || "Description"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                    formErrors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder={
                    t("DESCRIPTION_PLACEHOLDER") ||
                    "Describe the work you completed this week..."
                  }
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Confirmation Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.confirmed}
                    onChange={(e) =>
                      handleFieldChange("confirmed", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                  <span
                    className={`text-sm ${
                      formErrors.confirmed ? "text-red-600" : "text-gray-700"
                    } group-hover:text-gray-900`}
                  >
                    {t("TIMESHEET_CONFIRMATION") ||
                      "I confirm that the hours and work description provided are accurate and truthful."}
                  </span>
                </label>
                {formErrors.confirmed && (
                  <p className="mt-1 text-sm text-red-600 ml-7">
                    {formErrors.confirmed}
                  </p>
                )}
              </div>
            </div>
          ) : (
            // Read-only View
            <div className="space-y-4">
              {currentWeekTimesheet ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {t("HOURS_WORKED") || "Hours Worked"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentWeekTimesheet.hoursWorked} hours
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {t("PROJECT_TEAM") || "Project/Team"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {PROJECT_OPTIONS.find(
                          (p) => p.value === currentWeekTimesheet.project,
                        )?.label || currentWeekTimesheet.project}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {t("GIT_ISSUE_URL") || "Git Issue URL"}
                    </p>
                    <a
                      href={currentWeekTimesheet.gitIssueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {currentWeekTimesheet.gitIssueUrl}
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {t("DESCRIPTION") || "Description"}
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentWeekTimesheet.description}
                    </p>
                  </div>
                  {currentWeekTimesheet.submittedAt && (
                    <p className="text-xs text-gray-400 text-right">
                      {t("SUBMITTED_ON") || "Submitted on"}{" "}
                      {formatDateDisplay(currentWeekTimesheet.submittedAt)}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">
                    {t("NO_TIMESHEET_THIS_WEEK") ||
                      "No timesheet submitted for this week"}
                  </p>
                  <p className="text-sm mt-1">
                    {t("CLICK_TO_START") ||
                      "Click the button below to submit your hours"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            {isEditing || (!currentWeekTimesheet && isEditable) ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  {t("CANCEL") || "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("SUBMITTING") || "Submitting..."}
                    </>
                  ) : currentWeekTimesheet ? (
                    <>
                      <FiCheck className="w-4 h-4" />
                      {t("UPDATE") || "Update"}
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      {t("SUBMIT") || "Submit"}
                    </>
                  )}
                </button>
              </div>
            ) : isEditable ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                {currentWeekTimesheet ? (
                  <>
                    <FiEdit2 className="w-4 h-4" />
                    {t("EDIT") || "Edit"}
                  </>
                ) : (
                  <>
                    <FiClock className="w-4 h-4" />
                    {t("SUBMIT_TIMESHEET") || "Submit Timesheet"}
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("TIMESHEET_HISTORY") || "Timesheet History"}
          </h3>
        </div>

        <div className="overflow-x-auto">
          {timesheetHistory.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("WEEK") || "Week"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("HOURS") || "Hours"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("PROJECT") || "Project"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("DESCRIPTION") || "Description"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("STATUS") || "Status"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timesheetHistory.map((timesheet) => (
                  <tr
                    key={timesheet.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateDisplay(timesheet.weekStart)} —{" "}
                      {formatDateDisplay(timesheet.weekEnd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {timesheet.hoursWorked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {PROJECT_OPTIONS.find(
                        (p) => p.value === timesheet.project,
                      )?.label || timesheet.project}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {timesheet.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={timesheet.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="font-medium">
                {t("NO_HISTORY") || "No past timesheets found"}
              </p>
              <p className="text-sm mt-1">
                {t("HISTORY_WILL_APPEAR") ||
                  "Your submitted timesheets will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
