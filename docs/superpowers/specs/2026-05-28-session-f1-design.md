# Session F1 — Evidence Leaf Components

**Date:** 2026-05-28
**Session:** F1 of Tend your Engine
**Produces:** `EvidenceCard`, `EvidenceEditor`

---

## Scope change from original plan

`EvidenceViewer` is eliminated. The user chose inline tap-to-expand on `EvidenceCard`, which makes a separate viewer bottom sheet unnecessary. F1 produces two components, not three.

---

## EvidenceCard

### Props

```ts
interface EvidenceCardProps {
  entry: Evidence;
  isOpen: boolean;
  onToggle: () => void;
}
```

`EvidenceCard` is a controlled component. The parent (`PanelSelfWorth` in F2) holds `openId: string | null` and enforces one-open-at-a-time by passing `isOpen={entry.id === openId}` and `onToggle={() => setOpenId(openId === entry.id ? null : entry.id)}`.

### Collapsed state

Always visible:

- Title — `font-serif text-[15px] font-semibold leading-snug text-plum`
- Date formatted as `d MMM yyyy` — `font-sans text-[11px] text-muted`, right-aligned
- 2-line truncated preview of `what_i_did_well` — `font-sans text-[12px] text-muted line-clamp-2`

`situation` is not shown when collapsed.

### Expanded state

Revealed when `isOpen` is true:

- Title + date (same as collapsed)
- Label "Situation" — `font-sans text-[11px] text-muted uppercase tracking-widest`
- `situation` text — `font-sans text-[13px] text-plum whitespace-pre-wrap`
- Label "What I did well" — same label treatment
- `what_i_did_well` text — same text treatment, full (no truncation)

### Card shell

Whole card is a `<button type="button">` — consistent with `HardThingCard` and `SelfLoveCard`.
`bg-card rounded-2xl px-4 py-4`. No teal accent on the card itself — panel header carries the colour.

---

## EvidenceEditor

### Props

```ts
interface EvidenceEditorProps {
  userId: string;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}
```

### Shell

Uses `ProtocolModal` (same as `HardThingLogger`, `SelfLoveLogger`).
Header line: `"Evidence"` in `font-serif italic text-[18px] text-plum`.

### Fields

In order:

1. **title** — single-line textarea (rows=1), placeholder `"What would you title this moment?"`
2. **situation** — multiline textarea (rows=3), placeholder `"What was happening?"`
3. **what_i_did_well** — multiline textarea (rows=3), placeholder `"What did you actually do well here?"`

All three fields use: `w-full resize-none bg-card rounded-2xl px-4 py-3 font-sans text-[13px] text-plum placeholder:text-muted focus:outline-none`

### Validation gate

Submit button disabled until all three fields have non-empty trimmed values.

### Submit CTA

**"This is who you are."**

Button: `bg-teal text-canvas rounded-2xl py-3 font-sans text-[13px] font-medium` — `opacity-50` when disabled.

### Mutation

Uses `useAddEvidence(userId)`. The `date` prop is passed in from the parent (same pattern as `HardThingLogger` and `SelfLoveLogger`) — the component does not derive it internally. On success calls `onSuccess`.

---

## Tests

### `src/test/EvidenceCard.test.tsx`

- Renders collapsed: shows title, formatted date, truncated `what_i_did_well` preview
- Does not show situation label or text when collapsed
- Renders expanded (`isOpen=true`): shows title, "Situation" label + text, "What I did well" label + full text
- Calls `onToggle` when card is tapped

### `src/test/EvidenceEditor.test.tsx`

- Submit button disabled when all fields empty
- Submit button disabled when only `title` filled
- Submit button disabled when `title` + `situation` filled but `what_i_did_well` empty
- Submit button disabled when `title` + `what_i_did_well` filled but `situation` empty
- Submit button enabled when all three fields have non-empty trimmed values
- Calls mutation and `onSuccess` on valid submit
