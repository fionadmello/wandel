# Session D1 Design — HardThingCard, TodayIntentionField, PauseOverlay

## Scope

Three components for `PanelSelfRespect`:

1. **HardThingCard** — displays a logged hard thing with BDA visualization, insight line, and tap-to-reveal note
2. **TodayIntentionField** — optional text field at the top of the panel for setting today's intention
3. **PauseOverlay** — brief celebratory overlay scoped to the panel after a successful log

---

## Design token

Add `--color-gold: #c4883a` to the `@theme` block in `src/index.css`.

This is distinct from `--color-amber` (the Self-Love panel identity color). Gold is used exclusively for BDA dot fill — it carries no panel identity meaning.

---

## HardThingCard

### Layout

```
┌─────────────────────────────────────────────┐
│  Told my manager something wasn't working   │  ← Cormorant serif, 15px, font-semibold
│                                             │
│  ●      ●    ●                              │  ← BDA dots, bottom-aligned
│  Before During After                        │  ← 9px small caps muted labels
│                                             │
│  Hardest in the moment — and it passed      │  ← insight line, 11px italic muted
└─────────────────────────────────────────────┘
```

When tapped, the note expands below the insight line (if note is non-null). Tap again to collapse.

### Card shell

`bg-card rounded-2xl px-4 py-4` — no left accent border (that belongs to PanelHeader only).

### BDA dots

**Color:** `bg-gold` (the new token).

**Size formula (power scale):** `size = 4 + (v^1.8 / 10^1.8) * 32` px, where v is 1–10. Clamp to [4, 36].

Precomputed reference:
| v | size (px) |
|---|---|
| 1 | 4.0 |
| 2 | 5.8 |
| 3 | 7.6 |
| 4 | 9.9 |
| 5 | 12.6 |
| 6 | 15.6 |
| 7 | 19.2 |
| 8 | 23.2 |
| 9 | 27.7 |
| 10 | 36.0 |

**Opacity formula:** `opacity = 0.2 + (v / 10) * 0.75`. Clamp to [0.2, 0.95].

**Layout:** flex row, `items-end`, gap-5. Each dot column: flex-col, items-center, gap-1. Dot width and height set inline via computed values. Labels ("Before" / "During" / "After") below each dot.

The size and opacity computations live in `src/constants/bdaDotScale.ts`, exported as `dotSize(v: number): number` and `dotOpacity(v: number): number`.

### Insight line

Computed by `computeInsight(before, during, after)` in `src/constants/insightLine.ts`.

Rules (priority order, first match wins):

1. `max(b,d,a) - min(b,d,a) <= 2` → `"Steady — the challenge held its ground"`
2. `d === max(b,d,a) && a <= b && (d - a) >= 3` → `"Hardest in the moment — and it passed"`
3. `a === max(b,d,a)` → `"Still sitting with this one"`
4. `b <= 4 && d >= 7` → `"Harder than you expected, and you showed up anyway"`
5. `b >= 7 && a <= 4` → `"Easier than you braced for"`
6. fallback → `"It took courage, and you're through it"`

### Tap-to-reveal note

`note` field is `string | null`. When non-null, a tap anywhere on the card toggles an expanded note section below the insight line. Use local `useState<boolean>` for open state. The note renders in `whitespace-pre-wrap`, 12px, `text-muted`. No explicit "show note" button — the whole card is the tap target.

### Props

```ts
interface HardThingCardProps {
  entry: HardThing;
}
```

`HardThing` is already defined in `src/types/engine.ts`.

---

## TodayIntentionField

### Behaviour

- Textarea with placeholder `"What do you want to show up for today?"`
- Reads from / writes to `daily_intentions.hard_task` via `useDailyIntention` + `useUpsertDailyIntention`
- Saves on: (a) blur, or (b) tap on the checkmark icon
- The checkmark icon (`Check` from Lucide, 14px) appears only when the field is dirty (local value differs from saved value). Tapping it saves and removes the icon.
- After a successful save, show `"Saved."` in muted italic for 1.2s, then hide. Implemented via `useState<boolean>` + `setTimeout`.
- If `hard_task` is null or empty string, the field is empty and shows only the placeholder.

### Layout

```
┌─────────────────────────────────────────────┐
│  What do you want to show up for today?     │  ← textarea, bg-card rounded-2xl
│                                        [✓]  │  ← Check icon, appears when dirty
└─────────────────────────────────────────────┘
  Saved.                                         ← 11px italic muted, 1.2s visibility
```

### Styling

`bg-card rounded-2xl px-4 py-3` textarea. No explicit border. Font: DM Sans 13px, `text-plum`. Placeholder: `text-muted`. Min-height: 2 lines (~48px). Resize: none (fixed height). The checkmark icon is `absolute bottom-2 right-3` inside a relative wrapper.

### Props

```ts
interface TodayIntentionFieldProps {
  userId: string;
  date: string; // YYYY-MM-DD
}
```

---

## PauseOverlay

### Behaviour

- Absolute-positioned overlay covering the content area of `PanelSelfRespect`
- Triggered by the parent passing `visible: boolean` prop
- When `visible` goes true: overlay fades in immediately, auto-hides after 1.4s (parent controls the timer and flips `visible` back to false)
- Fade-out: CSS `transition-opacity duration-400` on the overlay element
- Does not block interaction while fading out (pointer-events: none always)

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│           You did great!                    │  ← Cormorant serif, 28px, text-plum
│                                             │
└─────────────────────────────────────────────┘
```

`bg-canvas/80` backdrop. Centered vertically and horizontally. `rounded-2xl` to match the panel container.

### Props

```ts
interface PauseOverlayProps {
  visible: boolean;
}
```

---

## Files

| Action | Path                                             |
| ------ | ------------------------------------------------ |
| Modify | `src/index.css` — add `--color-gold` to `@theme` |
| Create | `src/constants/bdaDotScale.ts`                   |
| Create | `src/constants/insightLine.ts`                   |
| Create | `src/features/engine/HardThingCard.tsx`          |
| Create | `src/features/engine/TodayIntentionField.tsx`    |
| Create | `src/features/engine/PauseOverlay.tsx`           |
| Create | `src/test/bdaDotScale.test.ts`                   |
| Create | `src/test/insightLine.test.ts`                   |
| Create | `src/test/HardThingCard.test.tsx`                |

---

## Out of scope (Session D1)

- `HardThingLogger` (bottom sheet, sliders) — Session D2
- `PanelSelfRespect` assembly — Session D2
- The "+N more" line — Session D2
