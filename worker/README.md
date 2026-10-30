# Intrigued Mutts checkout — release 1.0.0

The existing `mutts-paypal` Worker uses the production PayPal API. Its source is `mutts-paypal.mjs`.

## Checkout protections

Retail prices come from Printful, quantities and currency are validated, and each receipt needs its own order token. Creating an order additionally requires a single-use Cloudflare Turnstile token with action `checkout` and an approved production hostname. Browsing and receipt viewing do not require a login or CAPTCHA. The managed widget is shown in the cart; server validation fails closed. The secret is stored as `TURNSTILE_SECRET` in the existing Worker, never in source.

The `CHECKOUT_LIMITER` rate-limit binding uses namespace `919267103`, limit 60, period 60 seconds. Cloudflare's limits are approximate and local to each Cloudflare location. Requests over the limit receive HTTP 429 and Retry-After: 60. Request bodies are capped at 64 KiB. Arbitrary Codespaces preview origins are no longer allowed.

## Fulfillment reliability

PayPal webhook signatures are checked before processing. Completed capture amounts/currencies must match a stored order. An event is acknowledged only after processing and KV writes complete; transient failures return a non-2xx response so PayPal can retry. Printful external IDs (`mutts-<PayPal order ID>`) prevent duplicate fulfillment creation and let a retry recover a previously created draft. Versioned completion markers avoid relying on the old premature acknowledgement markers.

Existing secrets, ORDERS KV, and PRINTFUL_AUTO_CONFIRM=false are preserved. New Printful orders remain drafts. No real payment or production fulfillment is required for automated tests.

## Verification and releases

Run `npm run lint`, `npm test`, `npm run build`, and `npm audit` inside `intriguedmutts-react`. Tests mock external providers, including valid/invalid/replayed Turnstile responses, order retries, duplicate clicks, bad signatures, and mismatched captures.

`npm run deploy` requires a clean checkout and runs lint, tests, and build before publishing assets to gh-pages, dispatching the permitted Pages workflow, and waiting for its result. `release.json` identifies the frontend version and source commit. The Worker health endpoint reports its version and whether request limiting is configured.

Deploy the verified frontend first, then the Worker enforcement code, to avoid exposing a required verification step before clients can supply it. Worker source-only updates preserve configuration. Binding changes must retain every existing secret and binding.

## Remaining limits

Cloudflare rate limits are abuse controls, not a strict global quota. KV is eventually consistent; signature checks, retry responses, and Printful's unique external IDs protect the fulfillment retry path, but this is not a transactional cross-provider system. Provider outages can delay checkout or fulfillment. Tax rules still require business review. Physical mobile devices and real paid checkout are outside the automated verification scope.

Primary references:
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.printful.com/docs/#tag/Orders
