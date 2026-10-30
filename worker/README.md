# Checkout Worker

`mutts-paypal.mjs` is the reviewed source of the existing Cloudflare `mutts-paypal` Worker. It was retrieved from the deployed service on October 30, 2026. Deploy script content only; preserve its existing secrets, ORDERS KV binding, compatibility settings, and PRINTFUL_AUTO_CONFIRM=false.

Security changes: resolve retail prices from Printful's authenticated sync variant endpoint, validate quantities/currency, require the order-specific receipt token for capture, use a stable PayPal capture idempotency key, return completed receipts without recapturing, distinguish pending capture status, suppress receipt secrets and upstream response bodies, and disable response caching.

Run `npm test` in `intriguedmutts-react` for mocked Worker and DOM regression coverage. Tests never call payment or fulfillment providers.

Known follow-ups: fulfillment webhook deduplication still uses eventually consistent KV and acknowledges before background processing. A durable queue/transactional workflow is appropriate for stronger retry guarantees. Rate limiting and stricter preview-origin restrictions remain separate hardening opportunities. The existing state-based retail tax rules require a separate business/tax review. Real payment capture and fulfillment were deliberately not exercised during QC.

Production uses api-m.paypal.com; old sandbox comments were misleading. PRINTFUL_AUTO_CONFIRM remains false (draft fulfillment).

API references: https://developers.printful.com/docs/#tag/Sync-Products/operation/getSyncVariant and https://developers.cloudflare.com/workers/best-practices/workers-best-practices/.
