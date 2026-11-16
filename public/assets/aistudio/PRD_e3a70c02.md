# Plantly Product Requirements Document

**Status:** Draft for review  
**Product:** Plantly  
**Platforms:** iOS and Android  
**Business model:** Freemium subscription  
**Planning baseline:** Phase 4 Technical Architecture & Implementation Plan

## 1. Product vision

Plantly helps people understand and care for the plants they own. It combines a personal plant collection, practical care check-ins, reminders, and photo-assisted plant identification and symptom guidance in a calm, dependable mobile experience.

The product should feel approachable to beginners while remaining useful to experienced plant owners. Visual direction is balanced and calm, informed by the Tend workflow reference, with Plantly branding, an elegant wordmark, and light and dark themes.

## 2. Problem and opportunity

Plant owners often forget care tasks, do not know which advice applies to their conditions, and struggle to identify a plant or interpret visible symptoms. Fixed watering schedules and confident image guesses can mislead users. Plantly should make it easier to keep useful context about each plant, prompt users to check rather than blindly act, and communicate uncertainty when image evidence is weak.

## 3. Target users

- **New plant owner:** wants a simple way to identify a plant and know what to check next.
- **Busy plant owner:** wants reminders and a quick overview of what needs attention.
- **Experienced hobbyist:** wants organized profiles, notes, care history and flexible schedules.
- **Multi-plant caretaker:** wants to manage a collection without repeated, generic advice.

All plant owners are in scope. Household sharing and professional horticultural workflows are not part of the first release.

## 4. Goals and non-goals

### Goals

1. Let users build and maintain a personal plant collection.
2. Make care tasks easy to understand, edit and complete.
3. Provide useful photo-based identification and symptom guidance without overstating certainty.
4. Make reminders helpful, configurable and respectful of notification preferences.
5. Launch on iOS and Android with a low-cost, managed-service architecture.
6. Support localization, time zones, light/dark themes, accessibility and privacy from the start.
7. Offer a clear free experience and paid upgrade path.

### Non-goals for MVP

Social/community feeds, plant sales, expert consultations, sensors, a public plant encyclopedia, definitive disease diagnosis, pesticide dosing, user-trained models, multi-user household access, web app, and location-based climate predictions.

## 5. MVP scope

### Account and onboarding

- Users can explore core screens as a guest and create/link an account when they want cross-device sync.
- Email authentication and account recovery are supported at launch; additional sign-in methods remain an implementation decision.
- Ask for locale, time zone, preferred units and theme as needed, with sensible device-based defaults that users can change.
- Explain the value of reminders and ask for notification permission in context, after the user opts in.

### Plant collection

- Add a plant manually or request photo-assisted identification.
- Show common and scientific names as candidates until the user confirms them.
- Store user-editable name, photos, location label, notes and care preferences.
- View, edit, archive and delete plants.

### Care companion

- Show today’s care list and upcoming tasks.
- Allow users to complete, snooze, skip, reschedule, edit or disable tasks.
- Make care schedules editable and explain that needs vary by environment and season.
- For watering, prompt the user to check soil and decide; do not imply that a calendar reminder proves watering is needed.
- Record basic task history for each plant.

### AI identification and symptom guidance

- Accept a plant image, check basic quality, and return a candidate, a short candidate list, a request for more information, or an unsupported/unavailable state.
- For symptoms, separate visible observations from possible explanations and safe next steps.
- Ask for relevant context when it materially improves the guidance.
- Allow correction, retry and manual entry.
- Do not present an unverified result as a definitive botanical or disease diagnosis.

### Notifications

- Support local and push reminders where available, configurable quiet hours and opt-out.
- Keep lock-screen text generic and avoid exposing private plant details.
- Keep the in-app care list usable when push delivery is unavailable.

### Freemium and subscription

- Core plant and care features remain useful on the free tier.
- Paid tier may add a larger collection, a higher AI allowance and richer history.
- Exact plant limits, AI quotas, trial, prices and regional price tiers require validation before implementation.
- Support purchase, cancellation/expiration status, restore purchases and subscription management links.

### Privacy and account controls

- Explain AI image processing and optional analytics.
- Provide account export and deletion.
- Keep plant images private, strip image location metadata, and state retention periods clearly.

## 6. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | A user can add, edit, archive and delete a plant. | Must |
| FR-02 | A user can manually add a plant without using AI. | Must |
| FR-03 | An AI species guess remains unconfirmed until the user accepts it. | Must |
| FR-04 | Users can create and edit care schedules and see task status. | Must |
| FR-05 | Users can complete, snooze, skip or disable an individual care task. | Must |
| FR-06 | Reminder time follows the user's configured local time and time zone. | Must |
| FR-07 | AI analysis can abstain and request a better photo or additional context. | Must |
| FR-08 | Symptom outputs separate observations, hypotheses and safe next steps. | Must |
| FR-09 | Users can control theme, units, locale and notifications. | Must |
| FR-10 | Store subscription state is reflected consistently across devices. | Must |
| FR-11 | Users can restore purchases and reach store subscription management. | Must |
| FR-12 | Users can request data export and account deletion. | Must |
| FR-13 | AI usage limits are enforced server-side. | Must |
| FR-14 | App supports analytics consent preferences and excludes plant names, notes and images from analytics. | Must |
| FR-15 | User can keep task and plant information available in a useful cached view when offline. | Should |

## 7. Non-functional requirements

- **Security:** owner-scoped data access, private image storage, no privileged keys in the mobile app, authenticated webhooks, rate limits and auditable administrative access.
- **Reliability:** core collection and care workflows remain usable if AI or push providers are unavailable.
- **Performance:** common collection and task views should feel responsive on supported mid-range devices and typical mobile networks; precise targets are to be set during implementation.
- **Accessibility:** screen reader labels, dynamic text, sufficient contrast, touch targets and reduced dependence on color alone.
- **Localization:** no hard-coded UI strings; use locale-aware dates, units and notification text.
- **Privacy:** data minimization, explicit processing purposes, documented retention, export and deletion paths.
- **AI safety:** uncertainty, abstention, safe recommendation bounds and evaluation of false confident answers.
- **Cost:** usage caps, provider timeouts, image compression, spend alerts and AI kill switch.

## 8. UX principles

1. Show the next useful action without making the user feel behind.
2. Treat care reminders as check-ins, not commands.
3. Make plant details and schedules easy to correct.
4. State what the image visibly shows separately from what might explain it.
5. Ask for permission in context and explain its benefit.
6. Keep the experience visually calm, balanced and coherent in both themes.

## 9. Success measures

### Product

- Onboarding completion and first-plant activation.
- Time from install to first useful care task.
- Weekly active plants and care task completion/snooze/skip rates.
- AI completion, abstention, retry and user-correction rates.
- Free-to-paid conversion, restore success, retention and cancellation.

### Quality and operations

- Crash-free sessions and critical-flow completion on each platform.
- AI latency, error rate, cost per successful assessment and false-confidence review rate.
- Reminder delivery failure and opt-out rate.
- Cross-account authorization failures (target: zero) and account deletion completion time.

Quantitative targets must be set before beta based on baseline testing and cost limits.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| AI confidently identifies the wrong plant or cause | Abstain, keep candidates provisional, evaluate diverse images, allow correction and monitor false confidence. |
| Generic care schedules harm plants | Use ranges and check-ins, make schedules editable, and avoid presenting dates as biological certainty. |
| Image/provider costs grow unexpectedly | Tier quotas, compress uploads, deduplicate requests, set spend ceilings and provide graceful fallback. |
| Notification fatigue | Ask contextually, allow quiet hours/categories, tune frequency and make reminders easy to disable. |
| Global privacy/store requirements vary | Stage launch regions and review applicable legal and store obligations before release. |
| Vendor lock-in | Keep AI, billing and notification services behind narrow provider adapters. |

## 11. Dependencies and open decisions

- First launch regions and languages.
- AI vendor selected after evaluating a representative image set and privacy terms.
- Free tier limits, paid benefits, trial and prices.
- Sign-in methods at launch.
- Image retention windows and optional reuse for product improvement.
- Ownership and review process for care templates.
- Analytics provider and consent approach.
- Monthly budget ceiling and beta size.
- Detailed visual review against the original Tend PDF before design implementation; that PDF was not present in the local project mirror.

## 12. Release acceptance

MVP is ready for controlled release when the critical product requirements work on iOS and Android; RLS and storage authorization prevent cross-user access; AI abstention and outage paths are verified; subscription sandbox purchase and restore flows pass; timezone/DST scheduling is checked; deletion and export operate as documented; accessibility and privacy reviews are complete; and cost alerts and AI/push kill switches are ready.
