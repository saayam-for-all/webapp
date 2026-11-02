# Volunteer Dashboard: Functionality, APIs, permissions, and workflow

- Related issue: [webapp
  #1939](https://github.com/saayam-for-all/webapp/issues/1939)

## Scope and review baseline

- **This document covers:** The Volunteer Dashboard
  (`VolunteerDashboard.jsx`), detailing its frontend architecture,
  state management, default managed requests tab enforcement, current
  mock API integration, security constraints, and requirements needed
  before establishing a live production backend contract.
- **Source baseline:** Reviewed against the `dev` branch. Verification
  was performed via source inspection of the application codebase and
  existing component implementations.

## Purpose

The Volunteer Dashboard provides registered volunteers with a
specialized interface to view, filter, sort, and manage help requests
assigned to them or available within their operational pool.

According to the [Application groups, their privileges and dashboards
guide](https://github.com/saayam-for-all/docs/wiki/Application-groups,-their-privileges-and-dashboards),
users belonging to the Volunteer role have targeted access privileges to
handle community assistance coordination and track ongoing commitments.

## Current functionality & architecture

When a user with volunteer privileges navigates to `/dashboard` and
accesses the Volunteer view, the application orchestrates component
mounting, state synchronization, and data rendering.

### 1. Default Tab Enforcement

- The component executes a `useEffect` hook upon initial mount:

```js
useEffect(() => {
  if (activeTab !== "managedRequests") handleTabChange("managedRequests");
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

- This ensures that volunteers immediately land on the **Managed
  Requests** view (`managedRequests`), preventing invalid tab states.

### 2. UI Layout & Components

- **Tab Header:** Renders a primary styled tab button labeled
  **Managed Requests** (`bg-white text-blue-500 border-blue-500`).
- **Search & Filters:** Injects custom filtering controls dynamically
  through the `searchFilters` prop.
- **Data Table:** Renders records using the shared `Table` component
  (`src/common/components/DataTable/Table.jsx`), passing column
  headers, row data, sorting configurations, and pagination handlers.
- **Loading & Empty States:** While `isLoading` evaluates to `true`, a
  centered `LoadingIndicator`
  (`src/common/components/Loading/Loading.jsx`) with a sizing
  configuration of `50px` is displayed. Empty lists are handled
  natively by the shared table component.

### 3. Search, filtering, sorting, and pagination

- **Search:** Performs client-side string matching against record
  properties.
- **Filters:** Combines status, priority, category, and calamity
  filters passed down from parent state.
- **Sorting:** Handled through `sortConfig` and `requestSort`
  parameters, allowing users to toggle ascending/descending directions
  on table columns.
- **Pagination:** Managed using `currentPage`, `setCurrentPage`,
  `totalPages(filteredData)`, `totalRows`, and `rowsPerPage` change
  handlers.

---

## Current API integration

- **Service Method:** Currently invokes shared or mock service
  bindings (such as `getVolunteerRequests` or equivalent mock request
  endpoints) defined in `src/services/requestServices.js`.
- **HTTP Method:** `GET`
- **Endpoint Configuration:** Mapped via `src/services/endpoints.json`
  pointing to base endpoints (e.g., `v1/request/mockRequests` or
  equivalent mock routes).
- **Base URL:** Resolved dynamically via `VITE_BASE_API_URL`.
- **Authentication Header:** Handled automatically via Axios
  interceptors (`src/services/api.js`) which extract the AWS Amplify
  session ID token and append it to the `Authorization` header.
- **Response Payload Handling:** The parent orchestration layer
  extracts arrays using safety patterns:

```js
data?.data?.content || data?.content || data?.body || [];
```

- **Pagination Metadata:** Total page counts and total elements are
  read from response wrapper metadata (`totalPages`, `totalElements`)
  before being passed to the pagination controllers.

---

## Permissions & access control

- **Route Protection:** The dashboard route is wrapped under
  `ProtectedRoute`, requiring an active Redux authentication state.
  Unauthenticated users are redirected to `/`.
- **Dashboard Access Checks:** Validated through
  `canAccessDashboard()`, taking into account user privileges.
- **Role-Based Access Control (RBAC):** Restricted strictly to users
  assigned to the **Volunteers** role group, alongside administrative
  fallbacks defined in global RBAC matrices (`src/utils/rbac.js`).
- **Backend Enforcement Requirements:** Client-side visibility checks
  are insufficient; production backend endpoints must independently
  verify that the calling user possesses active volunteer
  authorization and owns or has permission to view the requested
  assignment pool.

---

## User workflow

1.  An authenticated user with volunteer privileges navigates to
    `/dashboard`.
2.  The UI switches to or defaults to the Volunteer Dashboard view.
3.  The component lifecycle triggers the `useEffect` hook, enforcing the
    `"managedRequests"` tab and initiating the data fetching sequence.
4.  The dashboard calls the assigned service method, displaying the
    `LoadingIndicator` until responses resolve.
5.  Once data is loaded, records are parsed, filtered, and rendered in
    the managed requests table.
6.  The user can interact with the interface by typing search queries,
    applying dropdown filters, sorting columns, or modifying pagination
    limits.
7.  Selecting a specific record navigates the user to the request
    details route (`/request/<requestId>`), passing router state context
    (`sourceDashboard: "volunteer"`).

---

## Requirements for production integration

---

Requirement Decision needed

---

**Record Scope & Ownership** Confirm backend filtering logic so
that volunteers only retrieve
records specifically assigned to
them or available in their open
pool.

**Endpoint Contracts** Replace mock endpoints with
dedicated RESTful endpoints
supporting server-side pagination,
sorting, and multi-parameter
filtering.

**Authentication & Authorization** Validate caller identity and role
tokens securely on the server side
independently of frontend checks.

**Mutation Rights** Clarify whether volunteers have
permissions to accept, release,
comment on, or update the status of
managed requests directly from this
view.

**Error Handling** Implement robust user-facing error
notifications and clear stale data
caches upon fetch failures.

---

---

## Known gaps & review questions

1.  The dashboard currently relies on mock service implementations
    rather than live database queries.
2.  Filter states and pagination totals require synchronization between
    client-side array slicing and server-side metadata payloads.
3.  Fetch errors currently log to the console without a dedicated
    user-facing failure UI state, which can leave stale rows visible.

---

## Validation checklist for the completed integration

- [ ] Verify access to the Volunteer Dashboard for authorized
      volunteer roles and proper redirection for unauthorized users.
- [ ] Verify that only requests assigned to or claimable by the
      logged-in volunteer appear in the table.
- [ ] Verify column rendering, category mappings, enum labels, and
      timestamps.
- [ ] Verify search queries, dropdown filters, column sorting, tab
      changes, and page navigation.
- [ ] Verify loading spinners, empty data states, and API error
      behaviors without stale records.
- [ ] Verify request details route navigation, reload reliability, and
      permitted status updates.

---

## Source references

- Volunteer Dashboard component
- Dashboard Orchestration container
- Shared Table component
- Request services and endpoints
- API and interceptor configuration
