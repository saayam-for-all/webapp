# Profile address validation (#1967)

Personal Information verifies the street and city in the selected state and
country before updating `personalInfo` in local storage. It still does not write
profile addresses to a backend API. This adapts the proposal by KanishkKumar11 in
[PR #1969](https://github.com/saayam-for-all/webapp/pull/1969) to the current `test`
branch, which stores country/state ISO codes and uses the `profile` namespace.

## Service configuration

Set `VITE_ADDRESS_VERIFICATION_URL` in your deployment environment (or `.env.local`
for development) to the search endpoint of a Nominatim-compatible service approved
for handling profile addresses, for example a self-hosted instance or an application
proxy backed by an appropriate provider. Restart Vite after changing the variable;
production builds must receive it at build time. Do not put service credentials
in a `VITE_` variable: those values are public in the browser bundle.

There is intentionally no public-service default. The
[public Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/)
prohibits submitting personal or confidential data. Its public endpoint also has
an application-wide maximum of one request per second, requires identification
and attribution, and forbids autocomplete. A client-side limiter cannot enforce
an application-wide quota. Production service configuration is required before
this change can be deployed for real profile addresses.

The configured service must support browser requests (or use a same-origin proxy),
structured `street`, `city`, `state`, `countrycodes`, `accept-language`,
`format=jsonv2`, `addressdetails=1`, and `limit=5` parameters, returning the
Nominatim JSON array including address components. No lookup occurs while typing.
Successful lookups are cached in memory for five minutes, with at most 20 entries.
Requests time out after ten seconds and are aborted when leaving the component.

## Matching and limitations

- A result must match the street, city/locality, state (name or ISO subdivision
  code), and country code. An entered house number must also match.
- Case, diacritics, common English road abbreviations, and house numbers before
  or after a street name are handled. Unicode street/city names and alphanumeric
  postal codes are accepted by the form.
- The city is not rejected based on the incomplete `country-state-city` dataset.
- Postal codes and apartment/address line 2 are preserved but are not verified
  by this street/city check.
- Geocoder coverage and naming differences can prevent verification of a real
  address. A no-match response means the address could not be verified, rather
  than proving it does not exist. No-match and service-unavailable messages differ.
- Missing configuration or service failures keep the form editable for retry and
  leave saved data and the saved-address flag unchanged.
- New messages are in `profile.json`, with English, French, and Spanish strings.
  Other supported languages use the existing English fallback.

## Local verification

```sh
npm test -- --runInBand
npm run build
npx eslint src/pages/Profile/addressValidation.js src/pages/Profile/addressValidation.test.js src/pages/Profile/PersonalInformation.address.test.jsx src/pages/Profile/PersonalInformation.jsx
```

The component integration tests exercise real i18next resources and the actual
save handler, using mocked network responses. They cover saved-data preservation,
country/state codes and legacy names, translated errors, international input,
duplicate saves, cancellation, and retries. Utility tests cover response matching,
timeouts, malformed responses, and caching. Live browser verification uses public
landmark data only; fixture responses separately exercise pending/failure states.

## Validation evidence

- Full Jest run: 90 suites, 1,248 tests, and 24 snapshots passed.
- Focused profile/address run: 66 tests passed.
- Production build passed; Vite reports a large-bundle warning.
- Changed JavaScript files have zero ESLint errors. The profile component retains
  its two existing warnings (mixed exports and an unnecessary hook dependency).
  Repository-wide lint reports 576 errors and 29 warnings in the existing baseline.
- Prettier and `git diff --check` passed.
- Signed-in testing in the actual local app covered required fields, a live public
  landmark lookup, city mismatch, pending-control locking, Cancel, persistence,
  missing service configuration, a simulated outage, stale-error clearing, and
  successful retry after recovery.
- Live testing used the Empire State Building address through a temporary local
  proxy restricted to known public landmark inputs, with upstream throttling and
  caching. Personal profile data was not sent to the public geocoder. Test data,
  endpoint overrides, and temporary browser instrumentation were restored/removed.

The production endpoint is still unresolved. Without configuration, this proposed
implementation blocks saving and preserves existing data. This limitation should
be resolved before the draft PR is marked ready for merge.
