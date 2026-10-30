# All Requests — Dashboard and API Notes

For [issue #1939](https://github.com/saayam-for-all/webapp/issues/1939).

## What the tab does

All Requests lets Admins and Super Admins review help requests. Open the relevant dashboard and select **All Requests**; both dashboards initially open on Analytics.

The table shows the request ID, subject, beneficiary/creator ID, lead volunteer ID, category, status, priority, and last updated date. Clicking a request ID opens its details.

Users can search, filter by category, status, type, priority, or calamity, and sort by column. The default order is most recently updated first. Each page shows 5 rows by default, with options for 10 or 20.

**Search, filters, and sorting only apply to the page already loaded.** The total count still comes from the server, so it may not match the number of filtered rows shown.

## Who can access it

| Dashboard | Allowed groups | URL |
| --- | --- | --- |
| Admin | `Admins`, `SuperAdmins` | `/dashboard?view=admin` |
| Super Admin | `SuperAdmins` | `/dashboard?view=superAdmin` |

These are the frontend access rules. The development environment has an override that allows all dashboards; backend permissions still need separate verification.

## API used

The tab calls `getAllPaginatedRequests` in `src/services/requestServices.js`.

```http
GET {VITE_BASE_API_URL}/v1/request/help-requests?page=0&size=5
Authorization: <Cognito ID token>
Content-Type: application/json
```

There is no request body. `page` starts at 0, and `size` controls how many records are requested. The shared API client adds the ID token without a `Bearer` prefix. Moving to another page makes a new request; changing the page size returns to the first page.

Example response shape, using sample values:

```json
{
  "data": {
    "content": [
      {
        "requestId": "REQ-EXAMPLE-001",
        "subject": "Help with groceries",
        "requesterId": "SID-EXAMPLE-001",
        "beneficiaryId": "SID-EXAMPLE-002",
        "creatorId": "SID-EXAMPLE-001",
        "reqIsleadId": 0,
        "requestCategory": "FOOD_ASSISTANCE",
        "status": "NEW",
        "priority": "HIGH",
        "updatedDate": "2026-10-29T12:00:00Z",
        "type": "Remote",
        "calamity": false
      }
    ],
    "totalPages": 1,
    "totalElements": 1
  }
}
```

The frontend also accepts a top-level `content` or `body` array, with pagination totals read from `data` or the top level. The backend team should confirm the final response format and valid category, status, and priority values.

A few field details matter:

- Send `requestId` and `requestCategory` for the table and request links to work correctly.
- Different beneficiary and creator IDs appear together in one column. Missing IDs fall back to `requesterId`.
- Lead Volunteer ID shows `requesterId` when `reqIsleadId` (or `reqIsLeadId`) is `1` or `"1"`. Missing identity values show a dash.

## What still needs work

**Bulk status changes:** Users can select requests, choose a status, and click Apply. Currently this only shows a warning and clears the selection. It does not save anything. The source suggests this endpoint, but it is still a proposal:

```http
PUT v1/request/admin/bulkUpdateStatus
```

```json
{
  "requestIds": ["REQ-EXAMPLE-001", "REQ-EXAMPLE-002"],
  "requestStatus": "CANCELLED"
}
```

The team needs to agree on allowed status changes, permissions, and how failed updates will be returned before connecting it.

**Profile links:** Clicking a beneficiary/creator or lead volunteer ID currently opens the logged-in user's profile. Loading the selected person's profile is still pending.

**Error feedback:** Loading shows a spinner, and an empty result shows “No requests found.” A failed list call is logged in the console, but there is no clear error message or retry button. Previous rows may remain visible after a failure.

**Search across all requests:** This needs backend support. The current list request only sends `page` and `size`.

## Checks before sign-off

Verify access with Admin, Super Admin, and other-role test accounts. Check pagination, row counts, identity fields, request links, and the empty/error states. Confirm that bulk Apply makes no update request until its API is connected. Also test quick page changes with a slow connection to check for older responses replacing newer results.

These notes come from reviewing the `dev` source at commit `33236cd`; live UI and backend testing are still pending.

Sources: [Dashboard](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/pages/Dashboard/Dashboard.jsx), [request service](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/requestServices.js), [endpoints](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/endpoints.json), [API client](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/api.js), and [access rules](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/utils/rbac.js).
