# Others Requests tab: functionality, APIs, permissions, and workflow

Related issue: [webapp #1939](https://github.com/saayam-for-all/webapp/issues/1939)

## Scope and review baseline

This document covers the Others Requests tab in the Beneficiary Dashboard. It describes the frontend implementation and the requirements that need confirmation before replacing the mock integration. It does not define a finalized backend contract or change application behavior.

Source baseline: `dev` commit `33236cd395ecf59fe4202e2eba440e17e4b1ea40`, reviewed October 29, 2026. The repository README directs pull requests to `dev`. Findings below apply to this commit; `main` contains an older dashboard implementation.

Verification was by source inspection. The application was not run and backend responses were not exercised.

## Purpose

The tab is intended to show requests filed by the logged-in user on behalf of other people. It is distinct from My Requests and from an administrator's All Requests view. The Beneficiary Dashboard renders a tooltip explaining this purpose.

The [application groups and dashboards guide](https://github.com/saayam-for-all/docs/wiki/Application-groups,-their-privileges-and-dashboards) describes beneficiaries as able to file requests for themselves and for others, using separate tabs.

## Current functionality

The Beneficiary Dashboard displays My Requests and Others Requests. Selecting Others Requests sets `activeTab` to `othersRequests`, resets the page to 1, clears the status filter and selected rows, and fetches data through `getOthersRequests()`. Category filters are deliberately retained. The tab handler also retains the search term, sort configuration, and type, priority, and calamity filters.

### Table fields

The Others Requests header list contains the following fields, in order:

| Header key | Data field resolved by the table | Purpose |
| --- | --- | --- |
| `requestId` | `requestId` | Request identifier; opens the request details route |
| `beneficiaryId` | `userId` | Identifier displayed for the beneficiary; mapping requires confirmation |
| `subject` | `subject` | Request summary |
| `updatedDate` | `updatedDate` | Last update timestamp |
| `creationDate` | `creationDate` | Creation timestamp |
| `type` | `type` | Request delivery type |
| `category` | `requestCategory` | Request category |
| `priority` | `priority` | Request priority |
| `calamity` | `calamity` | Calamity indicator |

Status is available as a filter but is not included in this tab's current table header list. Dates are formatted by the shared table using `en-US` date/time formatting in the browser's timezone.

### Search, filters, sorting, and pagination

- Search compares the search term, without case sensitivity, against string conversions of all record values. It runs in the browser and resets the page to 1.
- Shared filters cover status, category, type, priority, and calamity. These operate on fetched records in the browser. Volunteer Type filtering applies to the Volunteer Dashboard's managed requests, not this tab.
- Default sorting is `updatedDate` descending. Clicking a column header changes the sort field and direction. Category and beneficiary header keys are resolved to their mapped data keys for sorting.
- The initial page size is 5. The shared table slices the filtered records locally for Others Requests; server pagination is enabled only for My Requests in the Beneficiary view.
- The parent dashboard nevertheless obtains page totals from response metadata rather than calculating them from the locally filtered records. This needs validation when finalizing the API integration.

### Loading, empty, and error states

The parent sets loading state while fetching; the Beneficiary view shows a loading indicator. The shared table contains a No requests found state. Fetch failures are logged to the console, and loading is cleared in `finally`. The fetch error handler does not provide a dedicated user-facing error message or clear the previous records, so stale rows may remain after a failed tab change.

## Current API integration

| Item | Current implementation |
| --- | --- |
| Service | `getOthersRequests()` in `src/services/requestServices.js` |
| HTTP method | `GET` |
| Endpoint key | `GET_OTHERS_REQUESTS` |
| Relative endpoint | `v1/request/mockRequests` |
| Base URL | `VITE_BASE_API_URL` |
| Explicit query parameters | None |
| Request body | None |
| Authentication | Axios interceptor obtains the Amplify session ID token and sets `Authorization` to the token string when available |
| Service return value | Axios `response.data` |

The current client does not prepend `Bearer ` to the token. This documents existing code, not a recommendation for a future authentication contract.

The tab calls a mock HTTP endpoint; it does not directly select an Others Requests array from `Dashboard/data.js`. Managed Requests currently shares the same mock endpoint. The production response, ownership filtering, and authorization behavior are not established by this frontend call.

### Frontend response expectations

The dashboard chooses records using:

```js
data?.data?.content || data?.content || data?.body || []
```

The returned records must be an array. The table expects the data fields listed above. Filtering also reads `status` and `category`; category display and sorting resolve to `requestCategory`. This inconsistency needs resolution before approving a production schema.

The parent reads total pages from `data.data.totalPages` or `data.totalPages`, defaulting to 1. It reads total record count only from `data.data.totalElements`, defaulting to 0. These are frontend expectations, not a verified backend response specification. Unlike the My Requests branch, the Others Requests branch does not call `normalizeHelpRequestRecords()` before storing the response.

## Permissions

The dashboard route is nested under `ProtectedRoute`, which requires a Redux authenticated user; otherwise it redirects to `/`. Dashboard visibility is also checked with `canAccessDashboard()`.

In the regular RBAC access matrix, all five recognized groups can access the Beneficiary Dashboard: `Beneficiaries`, `Volunteers`, `Stewards`, `Admins`, and `SuperAdmins`. They access Others Requests through that dashboard. The helpers have additional fallback behavior: absent groups permit the Beneficiary Dashboard, and an environment value of `dev` in local storage bypasses dashboard access checks. These frontend rules do not establish backend authorization.

The production API must enforce the intended record scope: requests created by the authenticated user for another beneficiary. The backend team must confirm which identity fields establish this relationship. Membership in a role or permission to open the dashboard must not be treated as evidence that the caller can read or modify arbitrary requests.

Edit, cancel, delete, comment, and status-change permissions for requests created on behalf of another person require confirmation. The list tab itself provides navigation to request details rather than dedicated mutation controls.

## User workflow

1. An authenticated user opens `/dashboard` and selects the Beneficiary Dashboard if a different dashboard is active.
2. The user selects Others Requests. The tooltip identifies these as requests filed for other people.
3. The dashboard calls the mock service and displays its returned records after local sorting and filtering.
4. The user searches, filters, sorts, or moves through the locally paginated list.
5. Selecting a request ID navigates to `/request/<requestId>`. Router state includes the record, `sourceDashboard: "beneficiary"`, and `sourceTab: "othersRequests"`.
6. The shared request details page handles subsequent interactions. Its production data loading and action permissions must be verified for this request scope.

The dashboard also links to `/request` through Create Help Request. That action is gated by the dashboard's address check and directs users without an address to update their profile. The exact creation payload for an on-behalf-of request is outside this tab's verified API contract.

## Requirements for production integration

The following are proposed requirements to confirm with maintainers, not implemented or approved API contracts:

| Requirement | Decision needed |
| --- | --- |
| Record scope | Identify requests created by the caller for a different beneficiary; confirm creator, requester, and beneficiary field meanings |
| Endpoint and method | Confirm whether to extend the existing help-requests API or introduce a dedicated endpoint |
| Authentication and authorization | Validate caller identity on the server and enforce record access independently of frontend RBAC |
| Schema | Agree on `requestId`, beneficiary identity, subject, timestamps, type, category, priority, calamity, and status; resolve `userId` versus `beneficiaryId` and `category` versus `requestCategory` |
| Pagination | Choose server or client pagination and align record totals and page counts with filtering |
| Search and filters | Confirm supported query fields, category identifiers, status/type/priority enum values, and whether filtering occurs on the server |
| Request details | Support authorized loading by request ID after refresh or direct navigation, without requiring router state |
| Mutations | Confirm creator-versus-beneficiary rights for edit, cancel, delete, comment, and status updates |
| Error handling | Define empty, unauthenticated, forbidden, invalid-input, and server-error responses; add visible UI handling |

## Known gaps and review questions

1. The list uses `mockRequests` and sends no explicit creator, beneficiary, pagination, search, or filter parameters.
2. Display/sort category mapping and filtering use different properties; the beneficiary header maps to `userId`. Confirm the intended schema before documenting a finalized response example.
3. Client-side row slicing is combined with response-based totals. Validate multi-page results, filtered totals, and the page size selector.
4. Fetch failures can leave previous data visible without a user-facing failure state.
5. Confirm the on-behalf-of creation and details workflows, including authorization after reload and direct navigation.
6. Confirm whether a visible Status column is required alongside the existing Status filter.

## Validation checklist for the completed integration

- Verify access to the Beneficiary Dashboard for each supported group and unauthenticated redirects.
- Verify that only the caller's authorized on-behalf-of requests appear, with no requests created for the caller themselves or unrelated users.
- Verify all columns, category and beneficiary mappings, enum labels, timestamps, and absent optional values.
- Verify search and every filter together with sorting, tab changes, and page navigation.
- Verify loading, empty data, denied access, expired authentication, and API failures without stale records.
- Verify request details navigation, reload, direct links, and each permitted or denied mutation.

These checks are proposed acceptance checks; they were not executed during this documentation review.

## Source references

All code links are pinned to the reviewed `dev` commit:

- [Dashboard orchestration, headers, filtering, and navigation](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/pages/Dashboard/Dashboard.jsx)
- [Beneficiary Dashboard tabs and loading indicator](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/pages/Dashboard/views/BeneficiaryDashboard.jsx)
- [Shared table](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/common/components/DataTable/Table.jsx)
- [Request service](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/requestServices.js)
- [Endpoint configuration](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/endpoints.json)
- [Axios and authentication configuration](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/services/api.js)
- [RBAC helpers](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/utils/rbac.js)
- [Protected route](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/routes/ProtectedRoute.jsx)
- [Route definitions](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/routes/routes.jsx)
- [Request details](https://github.com/saayam-for-all/webapp/blob/33236cd395ecf59fe4202e2eba440e17e4b1ea40/src/pages/RequestDetails/RequestDetails.jsx)
