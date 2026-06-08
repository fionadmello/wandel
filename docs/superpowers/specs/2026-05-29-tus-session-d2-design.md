# Take Up Space — Session D2 Design

**PanelTakeUpSpace shell**

## Scope

The fourth engine panel: header, tags row, log header, entry log, seeding. Several pieces in the architecture's full component tree (`TakeUpSpaceLogger`, `TakeUpSpaceTagEditor`, `TakeUpSpaceReferenceCard`, `TakeUpSpaceFilterSheet`, `TakeUpSpaceCostEditor`) belong to later sessions (E, F, G, H1, H2) and don't exist yet — this session renders their trigger points as **inert stubs**: present, styled, in final position, but with no `onClick` handler. This keeps later sessions additive (wire a handler onto an existing element) rather than restructural.

Two adjustments from the original architecture sketch, made to satisfy `noUnusedLocals`/`noUnusedParameters` (both `true` in `tsconfig.app.json`) and to avoid hooks around values that cannot change yet — see "Forward notes" below for exactly how each gets un-deferred.

---

## 1. `PanelTakeUpSpace`

**File:** `src/features/engine/PanelTakeUpSpace.tsx`

```tsx
interface PanelTakeUpSpaceProps {
  userId: string;
}
```

No `date` prop in this session — nothing in the D2 shell consumes it (the only consumer would be the logger, which doesn't exist until Session F). Adding it now would be an unused destructured local and fail the build under `noUnusedLocals`.

Card wrapper, matching the other three engine panels:

```
flex flex-col gap-3 bg-card rounded-2xl border-l-[3px] border-l-rose px-5 py-4
```

### Structure, top to bottom

**a. Header**

```tsx
<PanelHeader
  number={4}
  title="Take Up Space"
  subtitle="Learning to stay with yourself"
  accent="rose"
  action={
    <button type="button" className="text-rose">
      <Info size={14} />
    </button>
  }
/>
```

Info button is inert (no `onClick`) — opens `TakeUpSpaceReferenceCard` via `OverlayModal` starting in Session E.

**b. Tags row**

```
flex flex-col gap-2
  flex justify-between items-center
    "Tags"   font-sans text-[10px] text-muted uppercase tracking-widest
    "Edit"   font-sans text-[11px] text-rose font-medium   (inert button, no onClick)
  <TakeUpSpaceTagChips tags={tags} />
```

Mirrors the Self-Love "Practices" row exactly (label + Edit + chips). Edit button is inert — opens `TakeUpSpaceTagEditor` starting in Session E.

**c. Empty state**

```tsx
{
  entries.length === 0 && (
    <p className="font-sans text-[12px] text-muted">
      What you notice lives here.
    </p>
  );
}
```

Matches `PanelSelfWorth`'s empty-state pattern.

**d. Log row header**

```
flex justify-between items-center
  filter button (left)    <Filter size={14} />   text-muted   (inert, no onClick)
  "+ Notice" button (right)   bg-rose text-canvas rounded-full px-4 py-2
                              font-sans text-[12px] font-medium flex items-center gap-1.5
                              <Plus size={13} /> + Notice    (inert, no onClick)
```

Filter button opens `TakeUpSpaceFilterSheet` starting in Session H2. "+ Notice" creates a draft entry and opens `TakeUpSpaceLogger` starting in Session F.

**e. Log**

```tsx
<TakeUpSpaceLog
  entries={entries}
  onContinueDraft={() => {}}
  onAddToCost={() => {}}
/>
```

Both callbacks are no-ops in D2. `onContinueDraft` becomes the discard-prompt/resume flow in Session G; `onAddToCost` opens `TakeUpSpaceCostEditor` in Session H1.

**f. Pause overlay**

```tsx
const pauseVisible = false;
// ...
<PauseOverlay visible={pauseVisible} message="You noticed." />;
```

Plain constant, not `useState` — nothing in D2 can ever set it `true` (that requires the completion flow built in Session G), and a hook around a provably-constant value is needless machinery. See "Forward notes" for the Session G change.

### Data wiring

```tsx
const { data: entries = [] } = useTakeUpSpaceEntries(userId);
const { data: tags = [] } = useTakeUpSpaceTags(userId);
const {
  isPending: seedPending,
  isSuccess: seedSuccess,
  mutate: seedMutate,
} = useSeedDefaultTags(userId);

useEffect(() => {
  if (tags !== undefined && tags.length === 0 && !seedPending && !seedSuccess) {
    seedMutate();
  }
}, [tags, seedPending, seedSuccess, seedMutate]);
```

Identical shape to `PanelSelfLove`'s practice-seeding effect — same guard conditions, same trigger (`length === 0`, not pending, not already succeeded).

---

## 2. Wiring into `EngineScreen`

```tsx
import { PanelTakeUpSpace } from "@/features/engine/PanelTakeUpSpace";
// ...
<PanelSelfWorth userId={userId} date={logDate} />
<PanelTakeUpSpace userId={userId} />
<WeeklyReviewPrompt ... />
```

No `date` passed — see Forward notes for Session F's change here.

---

## 3. Tests

**File:** `src/test/PanelTakeUpSpace.test.tsx`

Inert buttons are asserted by **presence**, not by simulating clicks — there is no behavior to observe on click, so a click-and-assert-nothing-happened test verifies nothing. Presence + correct label/icon is the meaningful claim at this stage.

| Test                                          | Assertion                                        |
| --------------------------------------------- | ------------------------------------------------ |
| Renders header with rose accent and number 04 | title, subtitle, accent classes present          |
| Renders "Tags" label, Edit button, and chips  | all three present when tags exist                |
| Seeds default tags when none exist            | `seedMutate` called once when `tags = []`        |
| Does not re-seed once tags exist              | `seedMutate` not called when `tags.length > 0`   |
| Shows empty-state message when no entries     | "What you notice lives here." visible            |
| Hides empty-state message when entries exist  | message absent, `TakeUpSpaceLog` renders entries |
| Renders filter button and "+ Notice" button   | both present with correct labels/icons           |
| Renders `PauseOverlay` (not visible)          | overlay present, `aria-hidden="true"`            |

---

## Forward notes — what later sessions change here

These are the exact edits each future session makes to un-defer the stubs left in D2. Recorded so nobody has to rediscover the shape of the change.

| Session | Element                 | Change                                                                                                                                                                                                                             |
| ------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E**   | Info button             | Add `onClick={() => setReferenceOpen(true)}`; render `{referenceOpen && <TakeUpSpaceReferenceCard ... />}` via `OverlayModal`                                                                                                      |
| **E**   | Edit button             | Add `onClick={() => setEditorOpen(true)}`; render `{editorOpen && <TakeUpSpaceTagEditor ... />}`                                                                                                                                   |
| **F**   | `PanelTakeUpSpaceProps` | Add `date: string`; update the `EngineScreen` call site to `<PanelTakeUpSpace userId={userId} date={logDate} />`                                                                                                                   |
| **F**   | "+ Notice" button       | Add `onClick` that creates a draft via `useCreateTakeUpSpaceEntry({ date })` and opens `TakeUpSpaceLogger`; render `{loggerOpen && <TakeUpSpaceLogger ... />}`                                                                     |
| **F**   | `pauseVisible`          | Replace `const pauseVisible = false` with `const [pauseVisible, setPauseVisible] = useState(false)`; wire `setPauseVisible(true)` into the logger's `onSuccess`/completion handler (mirroring `PanelSelfRespect.handleLogSuccess`) |
| **G**   | `onContinueDraft`       | Replace `() => {}` with the discard-prompt/resume handler — opens the inline "You have an entry in progress" prompt, wires `useAbandonDraft` → `useCreateTakeUpSpaceEntry` → reopen logger at resume step                          |
| **H1**  | `onAddToCost`           | Replace `() => {}` with a handler that opens `TakeUpSpaceCostEditor` for the tapped entry                                                                                                                                          |
| **H2**  | Filter button           | Add `onClick={() => setFilterOpen(true)}`; render `{filterOpen && <TakeUpSpaceFilterSheet ... />}` (`ProtocolModal`)                                                                                                               |

---

## Files changed

| File                                       | Change                                                     |
| ------------------------------------------ | ---------------------------------------------------------- |
| `src/features/engine/PanelTakeUpSpace.tsx` | Create                                                     |
| `src/features/engine/EngineScreen.tsx`     | Add import + render `<PanelTakeUpSpace userId={userId} />` |
| `src/test/PanelTakeUpSpace.test.tsx`       | Create                                                     |
