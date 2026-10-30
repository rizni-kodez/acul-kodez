# acul-kodez - Auth0 Advanced Customizations for Universal Login (ACUL) demo

Branded Auth0 login screens built on Auth0's official ACUL React sample
(auth0-samples/auth0-acul-samples, kept as git remote "upstream").
Customised screens: login-id, login-password, signup-id, signup-password,
reset-password-request, reset-password-email, reset-password, reset-password-success.
Brand tokens live in react/src/brand/.

## 1. Run locally (no Auth0 tenant needed)

Prerequisites: Node.js 22+.

    git clone https://github.com/rizni-kodez/acul-kodez.git
    cd acul-kodez/react
    npm install
    npm run dev

Open the URL Vite prints (normally http://localhost:3000). The Universal Login
Context Inspector panel lets you switch screens and mock data. In dev mode the
submit buttons only log "[DEV ONLY] ..." to the browser console; nothing is sent to Auth0.

Things to look at:
- react/public/screens/login-id/login-id/default.json - the mock context (what Auth0 puts on the page). Change client.name and watch the screen update.
- react/src/screens/login-id/hooks/useLoginIdManager.ts - the SDK action loginId.login({ username }) is the whole submit.
- react/src/brand/brand.ts and brand.css - change colours here only.

## 2. Test against a real Auth0 tenant (connected mode)

Requirements: Auth0 tenant on a paid plan, Universal Login (new experience),
a verified custom domain, Identifier First enabled, Auth0 CLI installed
(brew tap auth0/auth0-cli && brew install auth0). Use a DEV tenant only.

    auth0 login
    auth0 api patch prompts --data '{"identifier_first": true}'
    cd acul-kodez/react
    auth0 acul dev --connected --screens login-id,login-password

Answers: proceed = y, port = 55444, host with npx serve = Yes, build:watch = N.

Connected mode patches the tenant only when it detects a change, so in a second
terminal run "npm run build" once; the first terminal must show "Assets patched successfully". Then:

    auth0 acul config get login-id --file /tmp/login-id.json
    auth0 test login --domain YOUR-CUSTOM-DOMAIN --connection-name Username-Password-Authentication

rendering_mode in the downloaded file must be "advanced". Log in: login-id and
login-password are the custom screens; all other screens stay Auth0's standard UI.

## 3. Roll back (always, before you leave)

    for s in login-id login-password; do auth0 acul config set $s --data '{"rendering_mode":"standard"}'; done
    auth0 acul config list

## 4. Build for a CDN

    cd react && npm run build && ls dist/assets

Upload dist/ to a public CDN with CORS enabled and reference the hashed files in
each screen's rendering configuration (head_tags). Every script/css tag needs an
integrity hash: openssl dgst -sha256 -binary FILE | openssl base64 -A (prefix sha256-).

## Notes

- Commit messages follow conventional commits (feat: ..., fix: ..., max 72 chars) - enforced by a git hook.
- docs/ACUL_DEMO_CUSTOMIZATION_SPEC.md is the brief the screens were built from.
- Auth0 docs: https://auth0.com/docs/customize/login-pages/advanced-customizations
