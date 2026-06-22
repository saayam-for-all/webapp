# Changes — Issue #1589: Application Analytics Requests Tab API Integration

## Summary

Replaced static mock JSON data in the Application Analytics **Requests** tab with live API calls to the ML backend, following the same pattern already used by the Beneficiaries tab.

---

## Files Changed

### `src/services/endpoints.json`

- Added `REQUESTS_TREND_ANALYSIS` endpoint: `v1/ml/requestsTrendAnalysis`

### `src/services/analyticsServices.js`

- Added `getRequestsTrendAnalysis(payload)` — POST to `REQUESTS_TREND_ANALYSIS`
- Sends `{}` for preset ranges (7D / 30D / 1Y / All); sends `{ start_date, end_date, group_by }` for Custom

### `src/pages/Dashboard/components/Analytics/RequestsAnalytics.jsx`

- Removed static imports of `requests_volume_monthly.json` and `requests_by_category_region_monthly.json`
- Added `useEffect` fetch with `apiData / apiLoading / apiError` state (matches Beneficiaries pattern)
- Added `buildFetchParams(range, start, end, groupBy)` — returns `{}` for preset ranges, `{ start_date, end_date, group_by }` for Custom, `null` when custom dates not yet filled
- Trend response keys mapped per time range:
  - `"Requests count 7 days"`
  - `"Requests count 30 days"`
  - `"Requests count 1 year"`
  - `"Requests count all"`
  - `"Requests count custom date range"`
- Category/region bar chart: response key `"Requests count by category and country <period>"`, ISO alpha-3 country codes resolved to full names via `isoAlpha3ToName` (from `src/utils/isoCountryNames.js`)
- Custom range: `type="date"` inputs + **group_by** selector (Day / Month) shown when Custom is active
- Loading spinner while API call is in-flight
- Yellow warning banner + fallback to mock JSON when API errors
- Deduplication guard: `JSON.stringify` comparison prevents redundant fetches when switching between preset ranges

---

## Behaviour

| Time range | API payload sent                     | Response key used                  |
| ---------- | ------------------------------------ | ---------------------------------- |
| 7D         | `{}`                                 | `Requests count 7 days`            |
| 30D        | `{}`                                 | `Requests count 30 days`           |
| 1Y         | `{}`                                 | `Requests count 1 year`            |
| All        | `{}`                                 | `Requests count all`               |
| Custom     | `{ start_date, end_date, group_by }` | `Requests count custom date range` |

Country ISO codes (alpha-3) in the API response are converted to English display names using the shared `isoAlpha3ToName` utility added by the team in a previous PR.

---

## Testing

- Preset ranges (7D / 30D / 1Y / All) all resolve from a single `{}` API call — no extra network round-trips when toggling between them.
- Custom range re-fetches only when both dates are filled and the serialized params differ from the previous fetch.
- On API error the component falls back to the existing mock JSON and displays a warning banner — no white screen.
