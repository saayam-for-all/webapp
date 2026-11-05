# Availability local preview

Run `npm ci`, then `npm run dev -- --port 5178` and open
`http://localhost:5178/dev/availability-preview.html`.

This standalone entry renders the real Profile Availability component with a
synthetic Redux user and a local Axios fixture adapter. It never signs in or
calls Saayam's live APIs. Fixture settings persist only in this tab's
sessionStorage. The production application entry does not import this preview.

Use it to inspect responsive layout and edit/save/cancel behavior without an
account. Persistence here proves only the UI interaction with the adapter;
backend persistence is covered separately by the volunteer service integration
tests. Clear sessionStorage or open another tab to reset the fixture.

The production component uses authenticated `api` requests to
`v1/volunteer/availability` (POST to load, PUT to save, userId in JSON only).
Backend PR #215 plus the ownership-check follow-up must be reviewed and deployed
before frontend release. No new availability table is required by #214.
Vacation controls are disabled until the separate persistence work is available.
See the companion backend's `docsMD/profile-availability-214.md` for the contract
and deployment checklist.
