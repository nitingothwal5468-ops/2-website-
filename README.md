# Enlighting Humanity Trust website

A React/Vite website with an Express API, SQLite database, private admin workspace, transactional Sheets outbox and representative Pexels photography. No impact or fundraising figures are seeded. This is a deployable foundation, **not a fully production-certified launch**: legal texts, credentials, contact/address, consent, security and operational controls require Trust review.

## Local setup

Requires Node.js 20+ and npm. `npm ci`, copy `.env.example` to `.env`, and set a strong unique `SESSION_SECRET` (32+ characters). Start the API with `npm run server` and in a second terminal start the frontend with `npm run dev`. Open the Vite URL. The frontend proxies `/api` to port 3001. SQLite and private PDF uploads are in `data/` (never place this directory in a public web root). Forms persist without Sheets configuration.

## Admin setup

Create the first user on the host with `npm run admin:create -- you@example.com 'a-long-unique-password' admin`. Use a secret manager or an interactive administrative procedure in production: command-line arguments may be visible in shell history/process listings. Additional roles: `admin` can create/delete campaigns and see audit logs; `editor` can manage enquiries and read campaigns. Sign in at `/admin`. There is no default account or public registration. Rotate passwords by securely updating the database hash through an approved admin procedure. Deploy MFA, password recovery and account lifecycle controls before public launch.

## Data schema

SQLite is initialised automatically in `server.js`. Separate tables: contacts, volunteers, partnerships, corporate, donations, careers, sponsorships, newsletter_subscribers; each has name, email, mobile, location, message, details, optional attachment, status and created_at. Other tables: campaigns, admin_users, activity_logs, sessions, sync_queue. Values are parameterised. PDF uploads are limited to 5MB, checked for a PDF header, stored privately with random filenames and downloadable only by authenticated users. For production add malware scanning, stricter document validation, encryption and a data-retention/deletion process. Do not run multiple replicas against a local SQLite file; migrate to a managed database or provide a persistent, safely backed-up volume.

## Crowdfunding campaigns

In `/admin`, an administrator can create, edit, publish/unpublish and delete campaigns. Enter a title and story, choose a focus area, and optionally enter an end date, goal, funds actually received, and supporter count. The figures are manually entered: the application does not independently verify or reconcile them. Only enter numbers the Trust has verified. A draft is never publicly visible. A category selects an illustrative stock photograph, not a photo of Trust activities. The public `/campaigns` page and individual `/campaigns/:id` pages show published campaigns. Suggested support amounts and a custom amount lead to a database-backed donation enquiry; **no payment is collected and no donation or pledge is created**. Enquiry submissions never increase campaign totals. Admins must manually update verified figures. No campaign is preloaded. Payment processing, webhook signature checks, receipts, refunds, reconciliation and automated supporter counting must be designed and tested before online donations are enabled. The date is informational and does not automatically close an enquiry.

## Google Sheets integration

Optional: create an Apps Script bound to a spreadsheet, paste `scripts/sheets.gs`, configure the script property `WEBHOOK_SECRET`, and deploy as a web app. Set `SHEETS_WEBHOOK_URL` to its HTTPS URL and `SHEETS_WEBHOOK_SECRET` to the same long random secret in the server environment. Map forms to tab names in `SHEET_MAP` in the script. Each row includes a stable type/id key and is deduplicated on retry. Configure sheet access to trusted personnel only. The public Apps Script endpoint is authenticated by the secret in the POST body, not a substitute for managed IAM; rotate if exposed. No credentials are in browser code. If sync fails, the local record and queue persist; the worker retries with backoff every 30 seconds. Unconfigured entries remain pending and are retried after configuration/restart. Monitor failures and access to the sensitive sheet.

## Production deployment

Run `npm ci && npm run build`, then `NODE_ENV=production npm start` behind HTTPS with a persistent `data/` volume and a strong `SESSION_SECRET`. App serves the compiled SPA and API on `PORT` (default 3001). Configure your host, domain, TLS, access restrictions, logging and security monitoring. Cookies are Secure in production and require HTTPS. Set trusted proxy appropriately to your infrastructure (currently one hop). Schedule tested, encrypted off-site SQLite backups using SQLite's online backup API, and back up private uploads separately. Never copy a live database without SQLite-aware backup; WAL files matter. Do not deploy `.env`, databases or uploads as static assets. Review data privacy, consent, rates, CSRF, operational security, child image consent and applicable Indian law before launch. Obtain approved actual contact details, legal documents, credentials and media. Replace draft policies with lawyer-reviewed policies. Real payment processing, public document management, gallery editing, automated backup, MFA, unsubscribe emails, verified counters and video management are **not configured**.

## Testing checklist

- Run `npm run build`; visit every navigation/footer route, 5 initiative pages and links at desktop and mobile widths.
- Submit each of the 8 forms with valid and invalid values; check status messages and private admin records. Test PDF size/type errors and spam/rate-limit protection.
- Create an admin; verify invalid/valid login, logout, session persistence, search, status, pagination, CSV export, attachment access, campaign create/edit/publish/unpublish/delete, public draft visibility, progress, campaign enquiry, role restrictions and activity logs. Check editor restrictions.
- Enable Sheets with a test spreadsheet; test each mapping, duplicate delivery, outage and recovery. Confirm records remain in SQLite throughout.
- Review accessibility with keyboard, screen reader and reduced-motion settings. Validate contrast, image usage, policy text and consent with the Trust.
- Test HTTPS, cookie behavior, backups and restore, database persistence, rate limits, log access and roles in the actual production environment.

## Photo sources

Pexels stock photos are representative, not evidence of actual Trust work. Credits and source links are on `/credits`. Check licence, consent and suitability before launch.
