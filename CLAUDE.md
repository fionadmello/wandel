# Wandel — Claude Instructions

Inherits all rules from the global CLAUDE.md.

## Branching

- Until the MVP is shipped, all work stays on `main`. No feature branches.

## Commit and push workflow

- After each step within a phase is completed, automatically stage the relevant files, create a conventional commit, and push to `origin main`.
- Before every push: run the build and the full test suite. If either fails, stop, fix the issue, and re-run before pushing. Never push broken code.
- Always show the staged files and commit message before committing so the user can confirm.

## Package manager

- Use Bun exclusively. Never use `npm`, `npx`, `yarn`, or `pnpm`.
- Install: `bun install` · Run scripts: `bun run <script>` · Execute binaries: `bunx <binary>`

## Stack conventions

- Routing: TanStack Router only. No `react-router-dom`.
- Server state: TanStack Query for all Supabase data fetching and mutations.
- Forms: TanStack Form + Zod (`@tanstack/react-form`, `@tanstack/zod-form-adapter`). No uncontrolled inputs.
- Styling: Tailwind CSS utility classes only. No inline styles, no CSS-in-JS.
- Icons: Lucide React only.

## File structure

- One function per file, two at most. One export per file.
- Icon components live in their own files under `src/components/icons/`.
- All app-wide constants live in `src/constants/` as separate files (e.g. `tabs.ts`, `emotions.ts`, `markLabels.ts`).
- Complex reusable CSS values (shadows, gradients) go in `@utility` blocks in `src/index.css`, not in component files.

## Design system

- All colours must reference design tokens (`--canvas`, `--plum`, `--amber`, `--violet`, `--card`, `--border`, `--soft`, `--muted`, `--teal`). No raw hex values in components.
- Typography: Cormorant for emotional/heading text, DM Sans for all UI text.
- Match the design prototype exactly — no improvised layouts or spacing.

## TypeScript

- No `any`. Every Supabase response must be typed against the types in `src/types/database.ts`.
- All component props must have explicit interfaces.

## Testing

- Unit test all hooks in `src/hooks/`.
- Test all Zod schemas and form validation logic.
- Test any date/rotation logic (e.g. reminder rotation in Morning screen).
