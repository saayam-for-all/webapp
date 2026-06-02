# Amazon LinkedIn UI updated

This project now renders Amazon and LinkedIn sign-in buttons on the login page UI.

Current status:

- `Amazon` button is present but disabled.
- `LinkedIn` button is present but disabled.
- `Facebook` and `Google` remain active.
- Provider buttons are ordered alphabetically: Amazon, Facebook, Google, LinkedIn.

## Frontend files involved

- `src/pages/Auth/Login.jsx`
- `src/utils/config/aws-exports.js`
- `src/App.jsx`

## What needs to be configured when backend/auth providers are ready

Before enabling Amazon and LinkedIn in the frontend, make sure the following are completed in AWS Cognito and the provider consoles:

- Create or enable the external identity provider in the Cognito User Pool.
- Add the provider client credentials in Cognito.
- Configure Cognito callback and logout URLs to match this app.
- Confirm the provider is enabled for the same Cognito app client used by the web app.
- Confirm the provider returns at least the attributes needed by this app, especially `email`.
- Verify the existing redirect URLs in `src/utils/config/aws-exports.js` are valid for the environment being used.

## How to wire Amazon

1. Configure Amazon as an external identity provider in the Cognito User Pool.
2. Make sure the Cognito hosted UI app client includes `Amazon` as an enabled provider.
3. In `src/pages/Auth/Login.jsx`, replace the disabled Amazon button entry with an active click handler:

```jsx
const handleAmazonLogin = async () => {
  try {
    await signInWithRedirect({ provider: "Amazon" });
  } catch (error) {
    console.error("Error redirecting to Amazon:", error);
  }
};
```

4. Update the `socialProviders` entry for Amazon:

```jsx
{
  label: "Amazon",
  icon: <FaAmazon className="mx-2 text-xl text-gray-700" />,
  onClick: handleAmazonLogin,
  disabled: false,
}
```

## How to wire LinkedIn

1. Configure LinkedIn as an external identity provider in the Cognito User Pool.
2. Make sure the Cognito hosted UI app client includes `LinkedIn` as an enabled provider.
3. In `src/pages/Auth/Login.jsx`, replace the disabled LinkedIn button entry with an active click handler:

```jsx
const handleLinkedInLogin = async () => {
  try {
    await signInWithRedirect({ provider: "LinkedIn" });
  } catch (error) {
    console.error("Error redirecting to LinkedIn:", error);
  }
};
```

4. Update the `socialProviders` entry for LinkedIn:

```jsx
{
  label: "LinkedIn",
  icon: <FaLinkedinIn className="mx-2 text-xl text-[#0A66C2]" />,
  onClick: handleLinkedInLogin,
  disabled: false,
}
```

## Notes

- No `App.jsx` changes should be required if Amazon and LinkedIn are wired through the same Cognito hosted UI redirect flow already used by Google and Facebook.
- If Cognito exposes provider names with different casing than `Amazon` or `LinkedIn`, use the exact provider name expected by `signInWithRedirect`.
- After enabling either provider, test both the success path and the failure path from the hosted UI redirect back into `/dashboard`.

## LinkedIn federated logout (two-step)

LinkedIn users must be signed out of both Cognito and LinkedIn. Otherwise the next login attempt can silently reuse the LinkedIn session.

1. On login, `checkAuthStatus` stores the Cognito `identities` provider in `sessionStorage` (`authProvider`).
2. On logout, the app calls Cognito `signOut({ global: true })`, clears local auth state, then redirects LinkedIn users to LinkedIn's logout URL via `src/utils/linkedInAuth.js`.
3. Optional: set `VITE_LINKEDIN_CLIENT_ID` in the environment so logout uses LinkedIn's OIDC logout endpoint with a return URL to `/login`. Without it, the app falls back to `https://www.linkedin.com/m/logout/`.
4. Test: sign in with LinkedIn → logout → sign in again → LinkedIn should prompt for account selection or credentials, not auto-login.
