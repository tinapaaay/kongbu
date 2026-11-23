# Supabase setup and verification

ADR-002 was accepted by the product owner on 2026-11-21. The implementation is optional:
without configuration the app continues to store progress locally and offers file backups.

## Owner setup

1. Create a Supabase account and project. Sign in directly; do not share your password.
2. Run `supabase/migrations/202611210001_progress.sql` in the project's SQL editor (once),
   or apply it through the Supabase CLI migration workflow.
3. Enable email authentication. Set the production Site URL to
   `https://tinapaaay.github.io/kongbu/` and add
   `https://tinapaaay.github.io/kongbu/settings` to the redirect allow list.
   For local development also allow `http://localhost:5173/settings`.
   Then, under **Authentication → Emails**, edit the **Magic Link** and **Confirm signup**
   templates so they show the code: add a line such as `Your Kongbu sign-in code: {{ .Token }}`.
   Kongbu signs in with this typed code, not the link, because on iPhone a link opens Safari,
   which keeps separate storage from the Home Screen app. Keep the default code length.
4. Copy `.env.example` to `.env.local`. Fill in the project URL and its **public publishable
   key** (`sb_publishable_...`, recommended) or legacy **anon** key. Never use a secret or
   service-role key. These public values are intentionally included in the browser bundle.
5. For GitHub Pages, add repository Actions **variables** `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`. The existing deploy workflow passes them to the production build.
6. Open Settings, enter your email, and type the code from the email into the same app.
   Repeat on another device with the same email. Signing in adds that browser's existing records to the account.

The browser profile is bound to the first learner who syncs. Signing out keeps local progress.
To hand the browser to someone else (for example a shared computer), sign out, then choose
**Forget this device's progress** in Settings. It deletes this browser's records and its link to
the account; progress already synced stays in the account. The confirm step warns if any records
haven't synced yet. There is no account deletion UI yet.

## Data and security

Three append-only tables (`learner_quizzes`, `learner_attempts`, `learner_visits`) use a composite
`(user_id, id)` primary key. RLS grants authenticated learners SELECT and INSERT only for their
own user ID. Anonymous reads and all client UPDATE/DELETE operations are forbidden. INSERT
column grants prevent clients from forging `received_at`. Duplicate inserts use ON CONFLICT
DO NOTHING and preserve the first payload and receipt. No service key is needed by the app.

The durable queue is the set of local records lacking `serverReceivedAt`. Only a validated,
complete exchange acknowledges records. Partial failure leaves the queue intact for retry.
Sync runs after local saves, at sign-in, on reconnect/focus, every 30 seconds, and on Sync now.
Each sync downloads only rows received since the newest server receipt on this device, minus a
10-minute overlap. The overlap covers rows stamped just before a download but saved a moment
later; rows read twice are combined by ID. Records being sent whose first copy reached the server
before that point (a retry after a lost reply) are fetched by ID, so every sent record is confirmed.
A device with no receipts yet (new, or just forgotten) downloads everything. An index on
`(user_id, received_at, id)` keeps these reads fast.

Chapter visits are stored as one record per chapter per UTC day (`visit:<chapter>:<date>`), not
one per visit. A visit record still waiting to sync is updated in place; once the server has it,
later visits that day only update the device's own "last visited" time.

Unfinished quizzes are never uploaded. Backup restore unions IDs, preserves current records,
and combines visit ranges. Imported receipts are discarded so this account acknowledges the
records too. An existing unfinished quiz takes precedence over a backup's unfinished quiz.

## Verification

`npm run verify` covers local behavior, browser regressions, and the migration's RLS rules in
embedded PostgreSQL (`src/sync/database.test.ts`). `npm run test:e2e:sync` runs the real browser
client against a local HTTP simulation of Supabase, including two devices, offline/reconnect,
and duplicate retries. That simulation does not establish hosted Supabase correctness.

Before enabling production sync, verify with the actual configured project:

- Same learner in two browser profiles: complete different quizzes while offline, reconnect,
  and confirm both histories appear once on both devices. Keep a different unfinished quiz on each.
- Reload while offline with pending progress, then reconnect and confirm the queue drains.
- Interrupt a response after upload and retry: the record and its original receipt must appear once.
- Two different users: each can read only their own records; spoofing another `user_id` must fail.
- Anonymous reads, client timestamp injection, UPDATE, and DELETE must fail on all three tables.
- On an iPhone with Kongbu added to the Home Screen, sign in by typing the emailed code in the
  Home Screen app, and confirm that app (not Safari) is the one signed in.
- A wrong or expired code shows an error and keeps the code form open.
- Confirm sign-out retains local data, and switching accounts is blocked in an already bound profile.
- Built-in email sending allows only a few sign-in emails per hour. That is enough for one learner;
  set up custom SMTP (Authentication → Emails) before inviting others.
- A free project pauses after about a week with no activity. The app keeps working offline and
  sync shows that it needs attention; resume the project in the dashboard to continue.

Hosted authentication, SQL migration application, and live cross-device checks remain pending
until the owner provisions a project. Keep issue #5 open until those checks pass.

API behavior follows the official [email code sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless), [verifyOtp](https://supabase.com/docs/reference/javascript/auth-verifyotp),
[insert-on-conflict](https://supabase.com/docs/reference/javascript/upsert), and
[row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) documentation.
