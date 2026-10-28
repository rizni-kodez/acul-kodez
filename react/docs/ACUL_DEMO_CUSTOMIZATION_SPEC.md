# ACUL demo customization – implementation spec

You are working inside an existing Auth0 ACUL project: the official sample `auth0-samples/auth0-acul-samples`, folder `react/` (React 19 + TypeScript + Vite + Tailwind, SDK `@auth0/auth0-acul-react`). Your job is to turn the sample screens into a polished, branded, demo-ready login experience that shows what Advanced Customizations for Universal Login can do that standard Universal Login cannot — WITHOUT breaking the build pipeline or the Auth0 integration.

Read this whole file before changing anything. Work screen by screen, run `npm run build` after each screen, and stop with a summary when done.

---

## 0. Hard rules (do not violate)

1. **Do not change** `vite.config.ts`, `package.json` scripts, `scripts/*`, `public/manifest.json`, `src/main.tsx`, `src/App.tsx`, `src/DevScreenManager.tsx`, `src/ProdScreenManager.tsx`, `src/utils/screen/screenLoader*`, or any screen folder name. The Auth0 CLI connected mode depends on the exact `dist/assets/<screen>/`, `dist/assets/shared/`, `dist/assets/main.*.js` output structure.
2. **Keep every Auth0 SDK action exactly as it is** (`loginId.login`, `loginPassword.login`, `signupId.signup` / `signupPassword.signup`, `resetPasswordRequest.resetPassword`, `federatedLogin`, `passkeyLogin`, `resendCode`, …) and keep them wrapped in `executeSafely` from `src/utils/helpers/executeSafely.ts`. Do not call `fetch`/`XMLHttpRequest` yourself and do not add third-party network calls (the Auth0 host page is served under a strict CSP; external requests may be blocked). No external fonts, no CDN images: fonts = system stack, logo = inline SVG or `client.logo_uri` from context.
3. **Keep reading everything from the Auth0 context via the SDK hooks** (`useScreen`, `useTransaction`, `useErrors`, `useUntrustedData`, `useClient`, `useBranding`, `useOrganization`, etc.). Never hard-code links (signup / reset password / back) – use `screen.links` / the hook equivalents. Never hard-code the connection list – use `transaction.alternateConnections`.
4. **Keep `applyAuth0Theme()`** in every screen's `index.tsx`. Dashboard branding and texts must still override local defaults (precedence: `branding.settings` < `branding.themes.default` < `organization.branding`; `screen.texts` wins over `locales/en.json`).
5. Keep TypeScript strict and `npm run lint:check` clean. Update or remove tests under `__tests__` so `npm test` passes for the screens you touch.
6. No new runtime dependencies. Tailwind + existing deps only. (Icons: `lucide-react` is already present.)
7. Accessibility is not optional: every input has a label, errors are announced (`role="alert"` / `aria-live="polite"`), focus order is logical, colour contrast ≥ 4.5:1, everything works with keyboard only.
8. The dev-mode behaviour must stay: in `npm run dev`, actions only log `[DEV ONLY] …` to the console via `executeSafely`.

## 1. Brand (single source of truth)

Create `src/brand/brand.ts` and `src/brand/brand.css`, and import `brand.css` once from `src/index.css`. Everything visual reads from these. Replace values here later for a different brand – nothing else should need editing.

```ts
// src/brand/brand.ts
export const BRAND = {
  name: "Kodez",
  tagline: "Secure access, beautifully simple.",
  // Inline SVG logo markup string or null to fall back to client.logo_uri from context
  logoSvg: null as string | null,
  colors: {
    primary: "#ff7f56",
    primaryHover: "#cb6241",
    ink: "#231f20",
    paper: "#f5f4f2",
    surface: "#ffffff",
    muted: "#6b6667",
    line: "#e6e2df",
    success: "#1f9d61",
    error: "#d03c38",
  },
  radius: "12px",
  // Content for the left brand panel (bullets with icon names from lucide-react)
  panel: {
    headline: "One login for everything you do.",
    points: [
      { icon: "ShieldCheck", text: "Protected by Auth0 – MFA, passkeys and attack protection built in." },
      { icon: "Palette", text: "Fully branded screens, designed and deployed by your own team." },
      { icon: "RefreshCw", text: "Roll out screen by screen. Roll back in one click." },
    ],
  },
} as const;
```

```css
/* src/brand/brand.css – defaults; dashboard branding via applyAuth0Theme() can still override the --ul-theme-* vars */
:root {
  --brand-primary: #ff7f56;
  --brand-primary-hover: #cb6241;
  --brand-ink: #231f20;
  --brand-paper: #f5f4f2;
  --brand-surface: #ffffff;
  --brand-muted: #6b6667;
  --brand-line: #e6e2df;
  --brand-success: #1f9d61;
  --brand-error: #d03c38;
  --brand-radius: 12px;
  --brand-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    --brand-ink: #f3efed;
    --brand-paper: #16141a;
    --brand-surface: #1f1c24;
    --brand-muted: #a9a3a6;
    --brand-line: rgba(255, 255, 255, 0.12);
  }
}
```

Also set the sample's existing `--ul-theme-color-primary-button`, `--ul-theme-color-base-focus-color`, `--ul-theme-color-links-focused-components`, `--ul-theme-color-header`, `--ul-theme-color-body-text`, `--ul-theme-color-widget-background`, `--ul-theme-border-*-radius` defaults in `src/index.css` to the brand values so the existing ULTheme* components match.

## 2. Shared layout: split screen (the "only ACUL can do this" part)

Create `src/components/brand/BrandLayout.tsx` used by every screen listed in §4:

- Desktop (≥ 1024px): two columns. **Left panel** (45%): brand background (`--brand-ink` with a subtle diagonal gradient using `--brand-primary` at 12% opacity), logo top-left, `BRAND.panel.headline`, the three bullet points with lucide icons, and at the bottom a small line showing **live context**: `Signing in to <client.name>` plus `<organization.display_name>` when present and the current locale (`transaction.locale`). This proves the UI is data-driven. **Right panel**: the form card, vertically centred, max-width 440px.
- Mobile (< 1024px): single column; left panel collapses to a slim header bar with the logo and client name.
- Footer under the form (both sizes): links coming from context only (e.g. signup link on login screens, "Back to login" link on reset screens), and a small "Protected by Auth0" line (plain text, no external image).
- Logo: `BRAND.logoSvg` if set, else `client.logo_uri` from context (`<img>` with alt text from `screen.texts.logoAltText` or locale fallback), else the brand name as text.
- Respect `prefers-reduced-motion`. Subtle 150 ms transitions only.
- Card: `--brand-surface`, border `1px solid var(--brand-line)`, radius `var(--brand-radius)`, shadow `0 8px 24px rgba(0,0,0,.08)`.

Create small shared components in `src/components/brand/`: `BrandButton` (primary / secondary / ghost, loading spinner state, full-width option), `BrandInput` (floating or top label, inline error text, `aria-invalid`, `aria-describedby`), `PasswordInput` (BrandInput + show/hide toggle button with `aria-pressed` + **caps-lock warning** using `getModifierState("CapsLock")`), `ErrorBanner` (dismissible, `role="alert"`), `SocialButton` (icon + "Continue with <name>", name from `connection.name`/`strategy`), `StepIndicator` (e.g. "Step 1 of 2" on identifier-first screens), `IdentityChip` (shows the email already entered with an **Edit** link that navigates to `screen.links.edit_identifier` / `editIdentifierLink` when the SDK provides it, otherwise history.back()).

## 3. Behaviour that uses the context (show it off)

- **login-id**: prefill the identifier from `untrusted_data.authorization_params.login_hint` when present. Show social buttons from `transaction.alternateConnections` (Google exists on the demo tenant). Show passkey button only if `transaction.isPasskeyEnabled`. Show "Sign up" link only if `transaction.isSignupEnabled`. `StepIndicator` "Step 1 of 2".
- **login-password**: `IdentityChip` with the email from `untrusted_data.submitted_form_data` / `screen.data.username` (use whatever the SDK exposes – check `useScreen()` / `useUntrustedData()` types), `PasswordInput`, "Forgot password?" from `screen.links.reset_password` / `resetPasswordLink`, `StepIndicator` "Step 2 of 2". Field-level error from `errors.byField("password")`, general errors in `ErrorBanner`.
- **signup-id**: email input, optional additional identifiers only if the connection attributes say so (`transaction.connection.options.attributes` / SDK helpers such as `useSignupIdentifiers` if available), "Already have an account? Log in" from `screen.links.login`. Social buttons as on login-id.
- **signup-password**: `IdentityChip` with the email from the previous step, `PasswordInput`, and a **live password-policy checklist** driven by the policy in the context (`transaction.passwordPolicy` / `usePasswordPolicy` if exposed by the SDK; otherwise fall back to the policy fields present in the mock context). Each rule turns green as it is satisfied. Submit stays enabled (server is the source of truth) but the checklist updates live.
- **reset-password-request**: email input (prefilled from `untrusted_data.submitted_form_data` if present), clear copy, "Back to login" from `screen.links.back_to_login` / `backLink`.
- **reset-password-email**: confirmation state with an inline envelope icon, the masked email from context if available, and a **Resend** button that uses the SDK resend action (only if the screen exposes one – otherwise omit the button; do not invent an action).
- **reset-password** and **reset-password-success**: new password + confirm with the same checklist; success screen with a "Continue to login" link from context.
- Errors everywhere: general errors (`errors.byType("auth0")` without a field) → `ErrorBanner`; field errors → under the field; `hasError` focus management: move focus to the first error on render.
- Loading: button shows spinner and is disabled while `isSubmitting`; prevent double submit.
- Texts: always `screen.texts.<key> || locales.<...>`; update each screen's `locales/en.json` with good default copy (plain, friendly, short). Add `pageTitle` to each locale and set `document.title`.

## 4. Screens in scope (do these, in this order)

1. `login-id`
2. `login-password`
3. `signup-id`
4. `signup-password`
5. `reset-password-request`
6. `reset-password-email`
7. `reset-password`
8. `reset-password-success`

Leave all other screens untouched (they must still build).

## 5. Mock data for local demo

For every screen in §4 make sure a local mock exists under `public/screens/<prompt>/<screen>/default.json` (copy from the inspector's built-in data if the folder is missing) and register it in `public/manifest.json`, so `npm run dev` can show each screen with and without errors. Set in the login-id mock: `client.name = "Demo App"`, `organization.display_name = "Kodez"`, `transaction.alternate_connections = [{ "name": "google-oauth2", "strategy": "google-oauth2" }]`, `untrusted_data.authorization_params.login_hint = "demo.user@example.com"`. Add a `with-errors` variant for login-id, login-password and signup-password.

## 6. Verification checklist (run all, fix until green)

```bash
npm run lint:check
npm test
npm run build
ls dist/assets/login-id dist/assets/login-password dist/assets/signup-id dist/assets/signup-password dist/assets/reset-password-request dist/assets/reset-password-email dist/assets/reset-password dist/assets/reset-password-success
```
All four must succeed; the `ls` must list an `index.*.js` in each folder.

Then `npm run dev` and, in the inspector, for each screen in §4: default variant renders with the split layout; `with-errors` variant shows the banner / field error; pressing the primary button logs `[DEV ONLY] …` in the console; resize to < 1024px shows the mobile layout; Tab through the whole form with the keyboard.

## 7. Finish

Print a short summary: files created/changed per screen, the context fields each screen uses, anything from this spec you could not do because the SDK does not expose it (name the hook/type you checked). Do not start any other work.
