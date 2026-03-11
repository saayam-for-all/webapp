/**
 * Timesheet Services
 *
 * API Contract for Timesheet Management
 * Backend team should implement these endpoints following the defined request/response shapes.
 *
 * Database Schema:
 * ----------------
 * timesheets table:
 *   id              UUID PRIMARY KEY
 *   volunteer_id    UUID FK → volunteers(id)
 *   week_start      DATE NOT NULL          -- Monday of the timesheet week
 *   week_end        DATE NOT NULL          -- Sunday of the timesheet week
 *   hours_worked    DECIMAL NOT NULL
 *   project         VARCHAR(255) NOT NULL
 *   git_issue_url   VARCHAR(500) NOT NULL
 *   description     TEXT NOT NULL
 *   status          ENUM('pending','approved','rejected') DEFAULT 'pending'
 *   editable_until  TIMESTAMP NOT NULL     -- deadline after which volunteer can't edit
 *   submitted_at    TIMESTAMP DEFAULT NOW()
 *   updated_at      TIMESTAMP
 *   reviewed_by     UUID FK → users(id) NULLABLE
 *   reviewed_at     TIMESTAMP NULLABLE
 *
 * Index: (volunteer_id, week_start) with unique constraint
 *
 * Key Rules:
 * - Enforce edit window server-side: reject edit requests if NOW() > editable_until
 * - One timesheet per volunteer per week (unique constraint on volunteer_id + week_start)
 * - editable_until should typically be set to: week_end + grace_period (e.g., 3 days)
 */

import api from "./api";
import endpoints from "./endpoints.json";

/* =============================================================================
 * API ENDPOINT CONTRACTS
 * =============================================================================
 *
 * 1. GET /v1/volunteer/timesheets
 *    List timesheets for a volunteer (with filters)
 *
 *    Query Parameters:
 *    - volunteerId (required): UUID - The volunteer's ID
 *    - weekStart (optional): DATE (YYYY-MM-DD) - Filter by specific week
 *    - status (optional): string - Filter by status ('pending', 'approved', 'rejected')
 *    - startDate (optional): DATE (YYYY-MM-DD) - Start of date range
 *    - endDate (optional): DATE (YYYY-MM-DD) - End of date range
 *    - page (optional): number - Page number for pagination (default: 1)
 *    - limit (optional): number - Items per page (default: 20)
 *
 *    Response (200 OK):
 *    {
 *      "statusCode": 200,
 *      "message": "Timesheets retrieved successfully",
 *      "body": [
 *        {
 *          "id": "uuid",
 *          "volunteerId": "uuid",
 *          "weekStart": "2026-03-09",
 *          "weekEnd": "2026-03-15",
 *          "hoursWorked": 8.5,
 *          "project": "frontend",
 *          "gitIssueUrl": "https://github.com/org/repo/issues/123",
 *          "description": "Worked on feature X...",
 *          "status": "pending",
 *          "editableUntil": "2026-03-18T23:59:59Z",
 *          "submittedAt": "2026-03-15T10:30:00Z",
 *          "updatedAt": "2026-03-15T10:30:00Z",
 *          "reviewedBy": null,
 *          "reviewedAt": null
 *        }
 *      ],
 *      "pagination": {
 *        "page": 1,
 *        "limit": 20,
 *        "total": 15,
 *        "totalPages": 1
 *      }
 *    }
 *
 *    Error Responses:
 *    - 400 Bad Request: Invalid query parameters
 *    - 401 Unauthorized: Missing or invalid auth token
 *    - 403 Forbidden: User doesn't have permission to view these timesheets
 *
 * -----------------------------------------------------------------------------
 *
 * 2. GET /v1/volunteer/timesheets/:id
 *    Get a single timesheet entry
 *
 *    Path Parameters:
 *    - id (required): UUID - The timesheet ID
 *
 *    Response (200 OK):
 *    {
 *      "statusCode": 200,
 *      "message": "Timesheet retrieved successfully",
 *      "body": {
 *        "id": "uuid",
 *        "volunteerId": "uuid",
 *        "weekStart": "2026-03-09",
 *        "weekEnd": "2026-03-15",
 *        "hoursWorked": 8.5,
 *        "project": "frontend",
 *        "gitIssueUrl": "https://github.com/org/repo/issues/123",
 *        "description": "Worked on feature X...",
 *        "status": "pending",
 *        "editableUntil": "2026-03-18T23:59:59Z",
 *        "submittedAt": "2026-03-15T10:30:00Z",
 *        "updatedAt": "2026-03-15T10:30:00Z",
 *        "reviewedBy": null,
 *        "reviewedAt": null
 *      }
 *    }
 *
 *    Error Responses:
 *    - 401 Unauthorized: Missing or invalid auth token
 *    - 403 Forbidden: User doesn't have permission to view this timesheet
 *    - 404 Not Found: Timesheet not found
 *
 * -----------------------------------------------------------------------------
 *
 * 3. POST /v1/volunteer/timesheets
 *    Submit a new timesheet
 *
 *    Request Body:
 *    {
 *      "volunteerId": "uuid",           // Required: The volunteer's ID
 *      "weekStart": "2026-03-09",       // Required: Monday of the week (YYYY-MM-DD)
 *      "weekEnd": "2026-03-15",         // Required: Sunday of the week (YYYY-MM-DD)
 *      "hoursWorked": 8.5,              // Required: Decimal, must be > 0 and <= 168
 *      "project": "frontend",           // Required: Project/team identifier
 *      "gitIssueUrl": "https://...",    // Required: Valid Git issue URL
 *      "description": "Work done..."    // Required: Min 10 characters
 *    }
 *
 *    Response (201 Created):
 *    {
 *      "statusCode": 201,
 *      "message": "Timesheet submitted successfully",
 *      "body": {
 *        "id": "uuid",
 *        "volunteerId": "uuid",
 *        "weekStart": "2026-03-09",
 *        "weekEnd": "2026-03-15",
 *        "hoursWorked": 8.5,
 *        "project": "frontend",
 *        "gitIssueUrl": "https://github.com/org/repo/issues/123",
 *        "description": "Worked on feature X...",
 *        "status": "pending",
 *        "editableUntil": "2026-03-18T23:59:59Z",
 *        "submittedAt": "2026-03-15T10:30:00Z",
 *        "updatedAt": null,
 *        "reviewedBy": null,
 *        "reviewedAt": null
 *      }
 *    }
 *
 *    Error Responses:
 *    - 400 Bad Request: Validation errors (missing fields, invalid data)
 *    - 401 Unauthorized: Missing or invalid auth token
 *    - 409 Conflict: Timesheet already exists for this week (unique constraint)
 *
 * -----------------------------------------------------------------------------
 *
 * 4. PUT /v1/volunteer/timesheets/:id
 *    Edit a timesheet (only allowed within editable time window)
 *
 *    Path Parameters:
 *    - id (required): UUID - The timesheet ID
 *
 *    Request Body:
 *    {
 *      "hoursWorked": 10.0,             // Optional: Updated hours
 *      "project": "backend",            // Optional: Updated project
 *      "gitIssueUrl": "https://...",    // Optional: Updated URL
 *      "description": "Updated..."      // Optional: Updated description
 *    }
 *
 *    Response (200 OK):
 *    {
 *      "statusCode": 200,
 *      "message": "Timesheet updated successfully",
 *      "body": {
 *        "id": "uuid",
 *        "volunteerId": "uuid",
 *        "weekStart": "2026-03-09",
 *        "weekEnd": "2026-03-15",
 *        "hoursWorked": 10.0,
 *        "project": "backend",
 *        "gitIssueUrl": "https://github.com/org/repo/issues/456",
 *        "description": "Updated work description...",
 *        "status": "pending",
 *        "editableUntil": "2026-03-18T23:59:59Z",
 *        "submittedAt": "2026-03-15T10:30:00Z",
 *        "updatedAt": "2026-03-16T14:20:00Z",
 *        "reviewedBy": null,
 *        "reviewedAt": null
 *      }
 *    }
 *
 *    Error Responses:
 *    - 400 Bad Request: Validation errors
 *    - 401 Unauthorized: Missing or invalid auth token
 *    - 403 Forbidden: Edit window has closed (NOW() > editable_until) OR user is not the owner
 *    - 404 Not Found: Timesheet not found
 *
 * -----------------------------------------------------------------------------
 *
 * 5. PATCH /v1/admin/timesheets/:id/status (Admin-only)
 *    Update timesheet status (approve/reject)
 *
 *    Path Parameters:
 *    - id (required): UUID - The timesheet ID
 *
 *    Request Body:
 *    {
 *      "status": "approved",            // Required: 'approved' or 'rejected'
 *      "reviewNotes": "Good work!"      // Optional: Notes from reviewer
 *    }
 *
 *    Response (200 OK):
 *    {
 *      "statusCode": 200,
 *      "message": "Timesheet status updated successfully",
 *      "body": {
 *        "id": "uuid",
 *        "volunteerId": "uuid",
 *        "weekStart": "2026-03-09",
 *        "weekEnd": "2026-03-15",
 *        "hoursWorked": 8.5,
 *        "project": "frontend",
 *        "gitIssueUrl": "https://github.com/org/repo/issues/123",
 *        "description": "Worked on feature X...",
 *        "status": "approved",
 *        "editableUntil": "2026-03-18T23:59:59Z",
 *        "submittedAt": "2026-03-15T10:30:00Z",
 *        "updatedAt": "2026-03-17T09:00:00Z",
 *        "reviewedBy": "admin-user-uuid",
 *        "reviewedAt": "2026-03-17T09:00:00Z",
 *        "reviewNotes": "Good work!"
 *      }
 *    }
 *
 *    Error Responses:
 *    - 400 Bad Request: Invalid status value
 *    - 401 Unauthorized: Missing or invalid auth token
 *    - 403 Forbidden: User is not an admin
 *    - 404 Not Found: Timesheet not found
 *
 * =============================================================================
 */

/**
 * Get timesheets for a volunteer with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.volunteerId - The volunteer's ID (required)
 * @param {string} [params.weekStart] - Filter by specific week start date (YYYY-MM-DD)
 * @param {string} [params.status] - Filter by status ('pending', 'approved', 'rejected')
 * @param {string} [params.startDate] - Start of date range (YYYY-MM-DD)
 * @param {string} [params.endDate] - End of date range (YYYY-MM-DD)
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.limit] - Items per page
 * @returns {Promise<Object>} - Response with timesheets array and pagination
 */
export const getTimesheets = async (params) => {
  if (!params?.volunteerId) {
    throw new Error("Volunteer ID is required");
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const response = await api.get(
    `${endpoints.GET_TIMESHEETS}?${queryParams.toString()}`,
  );
  return response.data;
};

/**
 * Get a single timesheet by ID
 * @param {string} timesheetId - The timesheet ID
 * @returns {Promise<Object>} - Response with timesheet data
 */
export const getTimesheet = async (timesheetId) => {
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }

  const url = endpoints.GET_TIMESHEET.replace(":id", timesheetId);
  const response = await api.get(url);
  return response.data;
};

/**
 * Submit a new timesheet
 * @param {Object} timesheetData - The timesheet data
 * @param {string} timesheetData.volunteerId - The volunteer's ID
 * @param {string} timesheetData.weekStart - Monday of the week (YYYY-MM-DD)
 * @param {string} timesheetData.weekEnd - Sunday of the week (YYYY-MM-DD)
 * @param {number} timesheetData.hoursWorked - Hours worked (decimal)
 * @param {string} timesheetData.project - Project/team identifier
 * @param {string} timesheetData.gitIssueUrl - Git issue URL
 * @param {string} timesheetData.description - Work description
 * @returns {Promise<Object>} - Response with created timesheet
 */
export const submitTimesheet = async (timesheetData) => {
  if (!timesheetData?.volunteerId) {
    throw new Error("Volunteer ID is required");
  }
  if (!timesheetData?.weekStart) {
    throw new Error("Week start date is required");
  }
  if (!timesheetData?.weekEnd) {
    throw new Error("Week end date is required");
  }
  if (
    timesheetData?.hoursWorked === undefined ||
    timesheetData?.hoursWorked <= 0
  ) {
    throw new Error("Hours worked must be greater than 0");
  }
  if (!timesheetData?.project) {
    throw new Error("Project is required");
  }
  if (!timesheetData?.gitIssueUrl) {
    throw new Error("Git issue URL is required");
  }
  if (!timesheetData?.description) {
    throw new Error("Description is required");
  }

  const response = await api.post(endpoints.SUBMIT_TIMESHEET, timesheetData);
  return response.data;
};

/**
 * Update an existing timesheet (only within editable window)
 * @param {string} timesheetId - The timesheet ID
 * @param {Object} updateData - Fields to update
 * @param {number} [updateData.hoursWorked] - Updated hours worked
 * @param {string} [updateData.project] - Updated project
 * @param {string} [updateData.gitIssueUrl] - Updated Git issue URL
 * @param {string} [updateData.description] - Updated description
 * @returns {Promise<Object>} - Response with updated timesheet
 */
export const updateTimesheet = async (timesheetId, updateData) => {
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }

  const url = endpoints.UPDATE_TIMESHEET.replace(":id", timesheetId);
  const response = await api.put(url, updateData);
  return response.data;
};

/**
 * Admin-only: Update timesheet status (approve/reject)
 * @param {string} timesheetId - The timesheet ID
 * @param {Object} statusData - Status update data
 * @param {string} statusData.status - New status ('approved' or 'rejected')
 * @param {string} [statusData.reviewNotes] - Optional notes from reviewer
 * @returns {Promise<Object>} - Response with updated timesheet
 */
export const updateTimesheetStatus = async (timesheetId, statusData) => {
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }
  if (!statusData?.status) {
    throw new Error("Status is required");
  }
  if (!["approved", "rejected"].includes(statusData.status)) {
    throw new Error("Status must be 'approved' or 'rejected'");
  }

  const url = endpoints.ADMIN_UPDATE_TIMESHEET_STATUS.replace(
    ":id",
    timesheetId,
  );
  const response = await api.patch(url, statusData);
  return response.data;
};
