# Plantly Design System and UI Direction

**Status:** Draft design specification  
**Brand:** Plantly  
**Reference:** Tend-Workflow.pdf (high-level workflow and visual balance only; the source PDF was not available in the local project mirror during this draft)

## 1. Design intent

Plantly should feel calm, capable and welcoming. Use the balanced visual density selected in the project discussion: enough plant imagery and useful status to make the app feel alive, with clear hierarchy and generous breathing room. Tend is a workflow reference; Plantly retains its own identity, language and elegant wordmark.

The interface should make the next care action easy to find without making a care date feel like a warning. AI suggestions should look provisional until confirmed. The app launches with system, light and dark theme support.

## 2. Experience principles

1. **Care without guilt:** overdue tasks are neutral and easy to reschedule.
2. **Calm hierarchy:** one primary action per view; secondary actions remain discoverable.
3. **Plant-first imagery:** use user photos as helpful context, not decorative noise.
4. **Honest AI:** distinguish confirmed facts, visible observations and hypotheses.
5. **Consistent rhythm:** cards, spacing and typography repeat across Today, collection and detail.
6. **Inclusive by default:** readable contrast, scalable text, screen-reader semantics and non-color status cues.

## 3. Brand and visual language

- **Wordmark:** elegant “Plantly” wordmark; keep app icon simpler and recognizable at small sizes.
- **Shape language:** soft corners and subtle organic forms, balanced with a precise grid and clear dividers.
- **Imagery:** natural, truthful plant photography; avoid overly glossy or inaccurate plant visuals.
- **Iconography:** consistent line weight; pair ambiguous icons with labels.
- **Motion:** short, restrained transitions for task completion and navigation; respect reduced-motion settings.
- **Tone:** warm, direct and non-judgmental. Say “Check soil” instead of “Water now” when conditions are unknown.

## 4. Design tokens (initial direction)

These are starting token names and relationships; exact color values and typography should be confirmed with brand exploration and accessibility checks.

### Color roles

| Token | Light theme role | Dark theme role |
|---|---|---|
| `background` | Warm neutral canvas | Deep muted green/charcoal canvas |
| `surface` | White or lightly tinted cards | Elevated dark surface |
| `surfaceSecondary` | Soft neutral grouping | Secondary dark surface |
| `textPrimary` | Deep botanical charcoal | Warm near-white |
| `textSecondary` | Muted neutral | Muted light neutral |
| `brandPrimary` | Plantly botanical green | Accessible brighter botanical green |
| `brandAccent` | Gentle leaf/soil accent | Adjusted accent with sufficient contrast |
| `success` | Calm green | Light green semantic state |
| `warning` | Warm amber | Bright amber semantic state |
| `danger` | Muted red | Accessible light red |
| `border` | Soft gray-green | Subtle high-contrast border |

Avoid using brand green as the only indicator of success or selection. Add labels, icons or shape changes.

### Typography

- Use a highly readable sans-serif system family for UI text.
- Reserve any expressive display face for the wordmark or a small number of headings.
- Define semantic styles: `display`, `title`, `heading`, `body`, `bodySmall`, `label`, `caption`.
- Use tabular or aligned numerals for due dates and counts where useful.
- Respect OS text scaling; layouts must reflow without clipping.

### Spacing and shape

- Use a consistent 4- or 8-point spacing base and named spacing tokens.
- Card corners should be soft but not pill-like; buttons and input fields should share a clear radius system.
- Maintain comfortable thumb reach for primary actions and minimum touch sizes aligned with platform accessibility guidance.
- Prefer subtle elevation and borders over heavy shadows, especially in dark mode.

## 5. App shell and information hierarchy

Primary navigation: **Today**, **My Plants**, **Discover**, **Profile**. Bottom navigation remains stable across core screens. Page headings, back behavior and add actions should be predictable. Use safe-area spacing and native-feeling camera, photo picker, notification and purchase interactions.

### Today

- Greeting and concise summary.
- Care check-ins grouped by due timing, with plant thumbnail/name and clear action.
- Upcoming tasks in a lower visual priority.
- Empty state that invites adding a plant.
- Avoid streaks, guilt messaging or alarming red for ordinary missed tasks.

### My Plants

- Scannable grid/list with plant photo, user name and one useful status.
- Search, sort and simple filters as collection grows.
- Obvious add action, with manual entry and photo ID as equal paths.

### Plant detail

- Plant identity and confirmation state at top.
- Current care tasks and schedule controls next.
- Photos, notes and history in clear sections.
- Edit/archive/delete actions available without competing with daily care.

### Discover and AI results

- Explain photo purpose before upload.
- Show progress in a calm way.
- Make uncertainty visually clear but not alarming.
- Separate “What we can see,” “What may be happening,” and “What you can check next.”
- Never use a badge that implies a medically or scientifically definitive diagnosis.

### Paywall

- Show current tier and concrete benefit comparison.
- Use store-provided localized price and renewal details.
- Keep close, restore and management actions visible.
- Do not obscure access to a user’s existing plant information.

## 6. Components

- Navigation bar and page header.
- Plant card and plant identity badge (`confirmed`, `suggested`).
- Care task card with status, due label and quick actions.
- Schedule editor with interval range and local reminder time.
- Image capture/upload preview and quality hint.
- AI result panel with confidence tier, evidence, follow-up question and safety note.
- Empty, loading, offline and error states.
- Theme-aware form inputs, buttons, dialogs, toasts and bottom sheets.
- Subscription status/paywall components.

Components need documented states: default, pressed, focused, disabled, loading, error and selected where relevant.

## 7. Accessibility and localization

- Meet WCAG-style contrast goals for text and interactive controls; verify both themes.
- Use semantic headings and accessible names; announce task completion and AI results to screen readers.
- Do not communicate status through color alone.
- Support large text, reduced motion and screen-reader navigation.
- Localize all visible copy, pluralization, dates, units and subscription strings.
- Use explicit IANA timezone preferences for reminders; use locale-aware formatting for display.

## 8. Content design

Use concise, supportive, action-oriented language. Avoid absolute care claims where user conditions are unknown.

| Use | Prefer |
|---|---|
| Watering reminder | “Check whether the soil is dry.” |
| Missed task | “This check-in is past due. Reschedule or mark it done.” |
| AI uncertainty | “We can’t tell from this photo. Try a closer image of the leaf.” |
| Symptom candidate | “One possibility is environmental stress. Check recent light or watering changes.” |
| Permission | Explain the benefit before triggering the operating-system prompt. |

## 9. Design QA checklist

- Light and dark themes cover every screen, dialog, image overlay and error state.
- No text or task status clips at large accessibility text sizes.
- Empty, offline, loading, provider failure and permission-denied states are designed.
- AI candidates and confirmed plant names are distinguishable.
- Reminder labels reflect the user’s timezone and do not duplicate task state.
- Touch targets, contrast, labels and focus order are checked on iOS and Android.
- Detailed screen-by-screen Tend comparison is completed when the source PDF is available.
