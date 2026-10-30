# Intrigued Mutts storefront

Production frontend: https://intriguedmutts.com/ — release 1.0.0.

The React app lives in `intriguedmutts-react`. Run its `lint`, `test`, `build`, and `npm audit` checks before release. From a clean committed checkout, `npm run deploy` verifies and builds the app, publishes the assets to gh-pages, dispatches the permitted production workflow, and waits for deployment. `release.json` identifies the live frontend version and source commit.

The existing Cloudflare checkout Worker is maintained in `worker/mutts-paypal.mjs`; see `worker/README.md` for bindings, checkout protection, webhook retry handling, and release ordering. Turnstile protects PayPal order creation and does not introduce customer accounts. Its secret stays in Cloudflare. Never put a secret into a Vite/browser variable.

Dog transition videos and their navigation behavior must be preserved. No automated check may approve or capture a real payment. Fulfillment integration tests use mocked providers; production Printful auto-confirm remains disabled.
