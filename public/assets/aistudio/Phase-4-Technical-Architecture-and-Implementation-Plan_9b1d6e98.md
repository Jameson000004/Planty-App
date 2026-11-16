# Plantly — Phase 4: Technical Architecture & Implementation Plan

**Status:** Planning document  
**Date:** October 23, 2026  
**Product:** Plantly, a global iOS and Android plant-care companion

## 1. Executive summary

Plantly’s MVP should deliver a reliable plant collection, practical care schedules, photo-based plant identification and symptom guidance, and timely reminders in one polished mobile app. The product direction is a balanced, calm interface inspired by the Tend workflow, branded as Plantly with an elegant wordmark and complete light and dark themes.

For a low-cost launch, use **Expo + React Native + TypeScript** for the mobile app, **Supabase** for managed Postgres, authentication, private image storage and server functions, and **RevenueCat** to simplify cross-store subscription entitlements. Keep AI behind a provider adapter so the first identification/analysis service can be replaced without changing the app or data model. Begin with one deployable backend and managed services; avoid microservices and custom model hosting until measured demand justifies them.

The AI should assist rather than diagnose with false certainty. It must be able to abstain, show uncertainty, ask for another photo or clarifying details, distinguish observations from hypotheses, and avoid high-risk treatment instructions when evidence is weak. Care reminders should be framed as check-ins based on a plant’s profile and prior user actions, never as proof that a plant needs water.

## 2. Product scope and assumptions

### Agreed direction

- Audience: all plant owners.
- Platforms: cross-platform iOS and Android.
- Product scope: a full plant companion, delivered as a balanced MVP.
- Business model: freemium subscription.
- Cost posture: low-cost MVP, using managed infrastructure and usage limits.
- Global intent: design for localization, time zones, metric/imperial units and regional availability from the start.
- Visual direction: balanced, Tend-inspired workflow; Plantly brand; elegant wordmark; light and dark themes.

### MVP includes

1. Email sign-up/sign-in, account recovery, and guest exploration with an upgrade path to an account.
2. A personal plant collection with manual entry and photo-based identification.
3. Plant profiles with common/scientific name when available, location, light and watering preferences, notes, and plant photos.
4. Editable care schedules and a daily/weekly care list; users can complete, snooze, skip or reschedule tasks.
5. Photo-based symptom analysis with structured observations, confidence tier, safe next steps and a clear “uncertain” path.
6. Local and push reminders, with permission requested only after the user sees the value and opts in.
7. Free and paid entitlements, store billing, restore purchases, and account-level subscription status.
8. Privacy controls to export account data and delete the account and its images.
9. Basic product analytics, crash reporting and operational monitoring with consent and data minimization.

### Explicitly out of MVP

Social feeds, plant marketplace, expert consultations, sensor/hardware integrations, public user-generated plant encyclopedias, automated pesticide prescriptions, custom foundation-model training, web app, complex multi-user households, and location-based climate forecasting. These can be revisited using observed demand and safety evidence.

## 3. Architecture

```text
┌───────────────────────────────────────────────────────────┐
│ iOS / Android: Expo + React Native + TypeScript            │
│ Screens • offline task cache • local reminders • themes    │
└─────────────┬──────────────────┬──────────────────────────┘
              │ Supabase Auth/JWT │ HTTPS function calls
              ▼                  ▼
┌───────────────────────────┐  ┌────────────────────────────┐
│ Supabase                  │  │ Edge Functions             │
│ Postgres + RLS            │  │ AI orchestration            │
│ Private Storage           │  │ entitlement webhook         │
│ Auth                      │  │ push dispatch / cleanup     │
└───────────────────────────┘  └───────────┬────────────────┘
                                             │ provider adapters
                            ┌────────────────┴──────────────┐
                            ▼                               ▼
                    AI vision provider              RevenueCat / stores
                    (identify + analysis)           (Apple / Google)
```

### Recommended implementation shape

- **Mobile:** Expo-managed React Native, TypeScript, Expo Router, a small state/query layer, and a design-token system. Keep navigation and visual components shared; isolate platform-specific billing, permissions and notification details behind adapters.
- **Backend:** Supabase Postgres as the source of truth. Use Row Level Security (RLS) for every user-owned record and storage object. Use Edge Functions for privileged operations, AI provider calls, webhooks, and scheduled notification dispatch. Do not put service-role keys in the app.
- **Images:** private object storage, with short-lived signed URLs only when viewing or processing is authorized. Upload directly to storage after obtaining a constrained upload authorization; keep provider secrets on the server.
- **AI:** a server-side provider interface with request/response schema validation, per-user quotas, timeouts and provider/model version logging. Store compact results and user feedback; retain original photos only for as long as product needs and user settings allow.
- **Subscriptions:** RevenueCat SDK in the app; validate and process webhooks server-side. Entitlement is represented in the backend and refreshed from provider state. The client must not self-grant paid features.
- **Notifications:** local notifications for known care events and server-triggered push where cross-device delivery or time-zone rescheduling is needed. Keep payloads generic so sensitive plant details are not exposed on lock screens.
- **Environments:** separate development, staging and production Supabase projects and store products. No production user data in development.

### Stack alternatives and decision criteria

| Area | Recommended | Alternatives | Why this MVP choice |
|---|---|---|---|
| Mobile | Expo / React Native / TypeScript | Flutter; native Swift + Kotlin | One team can ship both platforms; Expo reduces native build and release overhead. Flutter is a sound choice if the team is already stronger in Dart. Native is justified for deep platform-specific needs or a larger platform team. |
| Backend | Supabase Postgres, Auth, Storage, Edge Functions | Firebase; custom API on AWS/Cloud Run | Relational plant, schedule and task data benefits from Postgres; managed auth/storage/functions reduce operations. Firebase is viable for a document-first team; custom infrastructure adds control but increases delivery and operating cost. |
| AI | Hosted multimodal vision API behind an adapter | Plant-specific identification API; on-device model | Hosted API minimizes initial ML work. Compare providers on supported regions, image retention/training terms, quality on a representative plant set, latency and cost before selection. A specialist API may outperform general vision for taxonomy; on-device is a later privacy/offline option. |
| Billing | RevenueCat | Direct StoreKit 2 + Google Play Billing | Reduces cross-store receipt and entitlement plumbing. Direct integrations avoid a vendor dependency but require more server-side lifecycle handling and testing. |
| Push | Expo Notifications / FCM / APNs | OneSignal; native-only | Expo aligns with the mobile stack and supports a small initial feature set. Evaluate delivery controls, data terms and cost before changing provider. |
| Analytics | Privacy-conscious event analytics (e.g. PostHog or a minimal first-party event table) | Firebase Analytics; no analytics | Select only after consent, retention and regional processing review. A small event set is sufficient for MVP decisions. |

**Selection gate:** before committing to paid providers, run a short technical spike against real representative plant photos and confirm data-processing terms, regional availability, current pricing, app-store requirements and exit path. Prices and terms change; this plan deliberately does not assume a fixed vendor price.

## 4. Domain model and database schema

Use UUID primary keys, `timestamptz` for instants, and explicit `user_id` ownership on user data. Every user-owned table needs RLS policies for select/insert/update/delete. Use `created_at`, `updated_at`, and soft deletion only where recovery or audit needs it; otherwise delete user content promptly.

| Table | Key fields | Purpose |
|---|---|---|
| `profiles` | `user_id` PK/FK auth.users, `display_name`, `locale`, `timezone`, `unit_system`, `theme`, `created_at` | User settings; never infer timezone from a one-time device offset. |
| `plants` | `id`, `user_id`, `name`, `common_name`, `scientific_name`, `identification_status`, `location_label`, `light_level`, `notes`, `archived_at`, timestamps | User’s plants and editable profile. Keep scientific identification as a candidate until confirmed. |
| `plant_images` | `id`, `user_id`, `plant_id`, `storage_path`, `purpose`, `mime_type`, `byte_size`, `captured_at`, `deleted_at` | Private image metadata. Never store public object URLs. |
| `care_templates` | `id`, `species_key` nullable, `task_type`, `min_interval_days`, `max_interval_days`, `seasonal_rules` JSONB, `source`, `version` | Curated baseline guidance; must express ranges/conditions rather than universal fixed schedules. |
| `care_schedules` | `id`, `user_id`, `plant_id`, `task_type`, `interval_days`, `next_due_at`, `local_time`, `enabled`, `source`, timestamps | User-adjustable recurring plan. `source` tracks template, AI suggestion or manual setup. |
| `care_tasks` | `id`, `user_id`, `plant_id`, `schedule_id`, `task_type`, `due_at`, `status`, `completed_at`, `snoozed_until`, `idempotency_key` | Individual task instances and user actions. Status enum: due, completed, snoozed, skipped, cancelled. |
| `ai_assessments` | `id`, `user_id`, `plant_id` nullable, `image_id`, `kind`, `status`, `provider`, `model_version`, `result` JSONB, `confidence_tier`, `created_at`, `expires_at` | Identification and symptom results with provenance and retention control. |
| `device_tokens` | `id`, `user_id`, `platform`, `push_token`, `locale`, `timezone`, `enabled`, `last_seen_at` | Per-device notification registration; revoke on sign-out/account deletion. |
| `subscriptions` | `user_id` PK, `entitlement`, `store`, `status`, `period_end`, `provider_customer_id`, `updated_at` | Normalized entitlement snapshot from verified provider events. No payment card data. |
| `consents` | `id`, `user_id`, `purpose`, `policy_version`, `granted_at`, `revoked_at` | Consent history for optional analytics, AI/image processing and notifications. |
| `feedback` | `id`, `user_id`, `assessment_id`, `rating`, `correction`, `created_at` | User feedback for quality evaluation; avoid collecting unnecessary free text. |

Suggested indexes: `(user_id, archived_at)` on plants; `(user_id, due_at, status)` on care tasks; `(user_id, plant_id, created_at desc)` on assessments; unique `(user_id, idempotency_key)` on task creation and webhook event IDs in a dedicated event ledger. Add foreign keys and cascade rules carefully so account deletion removes owned content and metadata.

### Example AI result contract

```json
{
  "schema_version": 1,
  "kind": "symptom_analysis",
  "status": "needs_more_information",
  "observations": ["small brown areas near leaf edges"],
  "candidates": [
    {"label": "environmental stress", "confidence_tier": "low"},
    {"label": "pest or disease", "confidence_tier": "low"}
  ],
  "follow_up_questions": ["Are the affected leaves soft or dry?"],
  "safe_next_steps": ["Check soil moisture before watering."],
  "safety_flags": [],
  "disclaimer_key": "plant_health_guidance_not_diagnosis"
}
```

Do not persist invented numeric probabilities as calibrated certainty. If a provider returns scores, calibrate them against an evaluated dataset before exposing them, otherwise map to conservative qualitative tiers.

## 5. API boundaries

Use Supabase client access for straightforward CRUD protected by RLS. Use versioned Edge Function endpoints for privileged or multi-step workflows. Require a valid user JWT, validate request size and MIME types, and return stable error codes and request IDs.

| Boundary | Example operation | Rules |
|---|---|---|
| Auth | Supabase Auth sign-up, sign-in, reset, refresh | Support email initially; consider Apple/Google sign-in after launch needs and store rules are reviewed. |
| Plant data | RLS-protected CRUD on plants, schedules, tasks | Client may edit user-owned fields only; server-generated identifiers and ownership cannot be changed. |
| Image upload | `POST /v1/uploads/authorize` then direct private-storage upload | Validate file type/size, randomize object path, strip EXIF/location metadata, enforce ownership and short-lived upload grant. |
| Identify | `POST /v1/ai/identify` with image ID and optional region/context | Server verifies image access, applies quota, calls provider, validates output, stores assessment, returns result. Idempotency key prevents duplicate paid calls. |
| Analyze symptoms | `POST /v1/ai/symptoms` with image ID, plant ID, observations | Same controls as identify; request clarification or abstain when quality/context is insufficient. Never directly modify care schedules. |
| Care actions | CRUD schedules; complete/snooze/skip task | Completion action is idempotent; updates future due date using user timezone/calendar logic. User always controls interval. |
| Entitlement | RevenueCat SDK; `POST /v1/webhooks/revenuecat` | Verify webhook authorization/signature as supported; deduplicate event IDs; derive entitlement from provider state. Never trust client purchase claims alone. |
| Push | `POST /v1/devices/register`; internal dispatch job | Store token per device, allow opt-out, localize, respect quiet hours, deduplicate sends, remove invalid tokens. |
| Account lifecycle | `POST /v1/account/export`, `DELETE /v1/account` | Re-authenticate sensitive actions, revoke tokens, delete images and records, document any legally required billing records retained by stores. |

Use a consistent error envelope: `code`, human-readable localized-safe `message`, `request_id`, and optional field errors. Avoid returning provider prompts, raw stack traces or secrets.

## 6. AI identification and symptom-analysis workflow

### Identification

1. Explain why the image is needed and obtain the relevant consent. Offer manual plant entry as an alternative.
2. Guide the user to photograph the full plant and, if useful, a leaf/flower close-up. Compress on device; remove EXIF metadata; reject unsupported or oversized files.
3. Upload to private storage using an opaque path. Run image-quality checks (blur, darkness, no plant, multiple subjects if the provider supports it).
4. Backend invokes the selected vision provider with a constrained prompt and JSON schema. Ask for top candidates, visible evidence, missing context and an abstain response; do not request certainty where evidence is insufficient.
5. Validate schema and safety rules. Return one likely candidate only when above an empirically validated threshold; otherwise show a short candidate list or ask for another photo.
6. Let the user confirm, correct or skip. Never silently write an AI guess into the plant’s confirmed scientific name.
7. Store provider/model version, response status and user correction for quality monitoring. Do not use images for model training unless the user separately opts in and terms permit it.

### Symptom analysis

1. Capture a focused close-up and optional whole-plant view; ask short context questions such as watering history, light changes and whether symptoms affect one or many leaves.
2. Make separate calls or structured stages for (a) visible observations and (b) possible explanations. Preserve the distinction in the UI.
3. Offer a limited set of plausible causes with qualitative confidence tiers and reasons. State when the photo cannot distinguish causes; prompt for better images or clarifying details.
4. Provide low-risk actions first: inspect soil and drainage, isolate a visibly infested plant where appropriate, check environmental conditions, or monitor a change. Do not prescribe pesticide dosage or assert a definitive pathogen from a photo alone.
5. Escalate caution for toxic plants, severe/rapid decline, edible crops, or treatment advice that could affect people, pets or the environment. Encourage qualified local advice when needed.
6. Show the date and a plain-language note that the output is informational guidance, not a definitive diagnosis. User decides whether to save notes or actions.

### Uncertainty and failure safeguards

- **Abstain:** explicit statuses: `identified`, `candidate_list`, `needs_more_information`, `unsupported`, `provider_unavailable`.
- **Evidence-aware UX:** explain what is visible and which contextual facts are unknown; never phrase candidate ranking as certainty.
- **Thresholds:** set and revise confidence thresholds only after evaluating a representative, geographically and visually diverse plant/photo set. Track false confident answers, not only top-1 accuracy.
- **Fallback:** on provider outage, preserve the photo and offer retry/manual entry; never fabricate a result.
- **Rate and spend limits:** quota by tier and user; request size cap; duplicate-request idempotency; per-provider timeout; circuit breaker; daily spend ceiling with graceful disable message.
- **Prompt and output hardening:** treat image content and user notes as untrusted input; constrain output schema; filter unsafe or irrelevant recommendations; do not allow the model to call tools or mutate data.
- **Evaluation:** maintain a versioned test set with common indoor/outdoor species, cultivars, lighting conditions, growth stages, pests, diseases and non-plant images. Review the worst failures before raising usage limits.

## 7. Care scheduling and notifications

Schedules are guidance, not biological sensors. Start with conservative ranges from curated templates and onboarding questions. Each schedule must be editable and explain that conditions, season, pot and soil can change the interval. Watering tasks should say “check soil” or “check whether watering is needed,” then let the user record what they did.

Store due instants in UTC plus the user’s IANA timezone and preferred local reminder time. Generate task instances transactionally with an idempotency key. On completion, calculate the next due date from schedule rules and local calendar days rather than adding fixed 24-hour blocks; this avoids daylight-saving shifts. On timezone change, preserve the intended local time. Snoozing changes one task; editing the schedule changes future tasks. Avoid duplicate push/local notifications for the same task and let the user set quiet hours and notification categories.

For small MVP scale, create local reminders for near-term due tasks and refresh them when the app opens or schedule changes; use push for cross-device or server-driven reminders. A daily server job can enqueue due pushes in batches. If push is unavailable, the in-app care list remains complete.

## 8. Authentication, media, freemium and subscriptions

### Authentication

Use managed email/password or passwordless email auth initially, with verified email and rate-limited recovery. Keep guest mode local until the user chooses account sync; when linking, merge locally created plants with an explicit conflict policy. Add Apple and Google login only after reviewing platform requirements and support burden. Do not collect birth date or precise location for the MVP.

### Image storage and retention

Use private buckets split by purpose if access policies differ. Paths should be random identifiers, not names or email addresses. Enforce owner-scoped object policies, MIME allowlists, size limits and signed URL expiry. Strip EXIF, especially GPS. Define retention per use: plant profile photos persist until user deletes them; transient analysis images can be deleted after a short stated period unless the user saves them. Account deletion removes objects, assessments and tokens through a retryable deletion workflow. Backups and provider retention windows must be documented accurately.

### Freemium recommendation

Make core care useful without payment. Proposed initial limit model (validate in product research):

- **Free:** a small plant collection (e.g. 5), basic care reminders, and a limited number of AI actions per month.
- **Plantly Plus:** larger/unlimited collection, higher AI allowance, richer history and advanced care tracking.

Choose final limits and prices after provider costs and store economics are known. Enforce AI limits server-side. Do not charge for access to existing user data or account export. Show trial/renewal/price terms clearly, offer restore purchases, and link to platform subscription management.

Subscriptions are purchased through Apple App Store / Google Play in-app purchase for mobile digital features. RevenueCat maps store products to a single `plantly_plus` entitlement; webhooks update the backend snapshot and are deduplicated. App gates paid actions using server entitlement plus cached provider status for offline UX. Handle grace period, billing retry, cancellation-at-period-end, refund, revocation, family sharing if enabled, and restore. Do not store card or raw receipt data unless specifically required by the chosen billing design.

## 9. Security, privacy and global readiness

- Apply least privilege: RLS on all user tables, private buckets, function secrets in managed secret storage, separate service roles, and no admin credentials in mobile code.
- Threat-model account takeover, IDOR across plant/image IDs, signed URL leakage, prompt injection in notes/images, malicious files, webhook replay, quota abuse and insecure debug logging.
- Validate input lengths, JSON schemas, image signatures, allowed types, object size and request rate. Use parameterized queries and bounded pagination.
- Encrypt in transit and rely on managed at-rest encryption; restrict production access and audit privileged operations. Rotate secrets and maintain a response plan for leaked credentials.
- Minimize collection: no precise GPS; strip image metadata; avoid sensitive notification text; do not send email, account IDs or plant notes to analytics.
- Provide clear consent and privacy notices for AI image processing, analytics, push and optional training. Honor withdrawal and deletion, and publish retention periods for app records, backups, logs and AI vendors.
- Confirm applicable privacy, consumer protection and app-store obligations for launch regions with qualified counsel; global availability is a product goal, not a claim of compliance in every jurisdiction.
- Localize UI strings, dates, units, plant terminology and notification content. Keep user timezone as an IANA identifier and store language/region separately. Support accessibility labels, dynamic text, contrast and screen readers.

## 10. Analytics and operational signals

Define a minimal event vocabulary: onboarding completed, plant added (source only, no name), care task viewed/completed/snoozed, identification started/completed/abstained/corrected, symptom assessment completed/abstained, paywall viewed, trial/purchase/restore outcome, notification permission/engagement, export/deletion requested. Use pseudonymous IDs, consent gating where required, sampling and retention limits. Keep plant names, free-text notes, raw images and AI prompt contents out of analytics.

Track product measures: activation (% adds first plant), time to first useful care task, weekly active plants, task completion/snooze rates, AI abstention/correction rates, free-to-paid conversion, retention, cancellation and support contacts. Operational measures: crash-free sessions, API latency/error rate, upload failures, provider latency/error/cost per successful assessment, notification delivery failures, webhook lag, database/storage growth and deletion completion time.

Set budget alerts and usage ceilings before public beta. AI cost should be attributed by operation and provider/model version. Alert on sudden cost or error spikes; fail closed for paid AI calls when the cap is reached while keeping core plant and care features available.

## 11. Testing and release quality

- **Unit:** schedule recurrence/time-zone/DST rules, entitlement mapping, quota logic, schema parsing, uncertainty mapping, localization formatting.
- **Integration:** RLS ownership matrix; storage access; upload validation; edge function auth; AI timeouts/invalid output; webhook replay and out-of-order events; account deletion retries.
- **Mobile:** onboarding, plant CRUD, task completion/snooze, light/dark themes, offline/reconnect, permissions denied, accessibility, purchase/restore and deep links on real iOS and Android devices.
- **AI quality and safety:** held-out photo set, top candidate accuracy, abstention quality, false certainty, unsupported content, non-plant images, poor-quality photos, regional and seasonal variation, and human review of severe errors.
- **Performance/reliability:** low-end device startup, compressed upload size, slow network, background/resume, push token rotation, database load and provider throttling.
- **Release gates:** no cross-user data access; all critical flows pass on both platforms; no unresolved critical/high security issues; privacy copy and deletion path reviewed; subscription products and restore tested in sandbox; AI quality thresholds approved; cost ceiling and incident alerts configured.

## 12. Deployment and operations

1. Use Git-based review with automated type checking, linting and unit/integration workflows on pull requests.
2. Deploy database migrations and Edge Functions to staging first; use backward-compatible migrations and a documented rollback path.
3. Build signed iOS/Android binaries using Expo Application Services (EAS) or an equivalent managed pipeline. Keep signing credentials in protected secrets and restrict release permissions.
4. Use internal distribution/test tracks, then a small opt-in beta. Verify push credentials, store billing, deep links, privacy manifests/disclosures and deletion requests on actual devices.
5. Release progressively where platform support permits; monitor crashes, API health, AI spend and subscription webhooks. Maintain a kill switch for AI and push independently.
6. Document incident contacts, data breach escalation, provider outage behavior, backup/restore, secret rotation and account deletion recovery.

Keep development, staging and production app IDs, API keys, buckets and store products distinct. No manual production database edits without a reviewed migration or recorded operational procedure.

## 13. Cost controls

- Stay on managed free/low tiers during private development; verify current limits before launch and set alerts at 50%, 75% and 90% of expected monthly budget.
- Compress images on device, cap resolution/size, delete transient images on schedule, and set storage lifecycle rules where supported.
- Run inexpensive quality checks before paid vision calls; limit the number of images and candidate outputs; cache only where privacy permits; avoid repeated calls on unchanged images.
- Start with small AI quotas; use per-user daily/monthly limits, concurrency caps, provider timeouts, idempotency and a global spend kill switch.
- Avoid always-on servers, custom model hosting, real-time features and complex analytics until usage data supports them.
- Batch notification work and retain short operational logs. Keep analytics event volume modest and sample noisy events.
- Review total cost per monthly active user, per successful AI action, per GB stored and per notification cohort monthly. Reassess vendor alternatives if usage nears paid thresholds.

## 14. Phased implementation milestones

| Phase | Work | Exit evidence |
|---|---|---|
| 0. Validation and setup | Confirm MVP limits, launch regions, privacy posture, provider comparison, design tokens and data lifecycle; create dev/staging/prod projects and app skeleton. | Approved vendor shortlist, threat model, UX flows, cost envelope and decision log. |
| 1. Product foundation | Auth, profile/preferences, Plantly visual system with light/dark themes, plant collection, private image upload, RLS and basic offline behavior. | Users can securely create/edit/delete plants on iOS and Android; ownership tests pass. |
| 2. Care companion | Templates, editable schedules, task generation/actions, timezone-aware local reminders, notification settings and in-app care list. | Schedule behavior verified around DST/time-zone change; no duplicate tasks or reminders. |
| 3. AI companion | AI adapter, identify and symptom workflows, upload quality checks, uncertainty/abstention UX, quotas, feedback and quality dashboard. | Held-out evaluation meets agreed quality/safety thresholds; spend caps and provider outage fallback demonstrated. |
| 4. Monetization and beta | RevenueCat/store products, paywall, entitlements, restore, webhook processing, analytics, crash monitoring, account export/deletion. | Sandbox purchase lifecycle passes on both stores; privacy/deletion and operational runbooks reviewed. |
| 5. Controlled launch | Accessibility/localization polish, store submissions, staged rollout, cost and support monitoring. | Release acceptance criteria met; on-call and rollback/kill-switch procedures ready. |

Milestone durations should be estimated by the implementing team after vendor and UX validation; the phases are intentionally ordered by dependency, not calendar promise.

## 15. Acceptance criteria for MVP

### Product

- A user can create an account, add a plant manually or from AI candidates, edit it, archive/delete it, and see the collection after signing in on another device.
- AI never silently commits an uncertain species; it can abstain and gives a useful next step.
- A user can configure, complete, snooze, skip and disable care tasks; reminders respect local time, timezone and opt-out settings.
- The main experience works in light and dark themes, supports large text and screen readers, and uses Plantly branding.
- Free limits and paid benefits are understandable; purchase, cancellation, expiration and restore states are accurately reflected.

### Engineering and safety

- RLS and storage policies block cross-account reads/writes, including guessed UUIDs and signed-object paths.
- Secrets, raw provider responses and private notes do not appear in client logs or analytics.
- AI request/response validation, quota enforcement, idempotency, outage fallback and global cost cap are verified.
- User export and deletion remove profile, plants, assessments, images, device tokens and analytics identifiers within the documented service window, subject to disclosed backup retention.
- Store purchase webhooks are authenticated, deduplicated and safe under replay/out-of-order delivery.
- Release candidate passes critical iOS and Android flows, accessibility checks, operational alerts, backup/restore exercise and security review.

Quantitative AI thresholds, latency targets, free limits, subscription prices and monthly infrastructure budget remain to be agreed after representative evaluation and vendor quotes.

## 16. Open decisions

1. Which countries/languages are in the first public release, and is “global” a staged roadmap or day-one availability?
2. Which AI provider best balances plant-specific accuracy, supported regions, image-retention terms, latency and cost on a Plantly evaluation set?
3. Should transient AI photos be deleted immediately after assessment, retained for a short retry window, or saved only when the user opts in?
4. What are the free plant count, AI action allowance, paid feature set, trial, prices and regional price tiers?
5. Which auth methods launch: email only, Apple/Google, or guest-first with later account linking?
6. Are care schedules initially fully curated/manual, AI-assisted, or a mix? Who owns review and updating of care templates?
7. Which analytics provider and consent model fit launch regions and the desired privacy posture?
8. What monthly spend ceiling, beta user count and AI quality thresholds define a successful low-cost launch?
9. Is community, expert review or user-contributed correction data a post-MVP direction, and what moderation burden would it add?
10. Confirm detailed Tend screen and interaction references against the original PDF before design implementation; the file was not present in the local project mirror during this planning pass.

## 17. Reference links

These official documents support the stack boundaries and should be rechecked during implementation because platform APIs and vendor terms evolve:

- Expo push notifications overview: https://docs.expo.dev/push-notifications/overview/
- Expo Application Services: https://docs.expo.dev/eas/
- Supabase Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- Supabase signed URLs: https://supabase.com/docs/guides/storage/serving/downloads
- RevenueCat documentation: https://www.revenuecat.com/docs
- Apple auto-renewable subscriptions: https://developer.apple.com/app-store/subscriptions/

