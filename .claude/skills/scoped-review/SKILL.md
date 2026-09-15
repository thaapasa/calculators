---
name: scoped-review
description: Scoped code review — determines the change scope (explicit, discussion, or git), picks a source of truth (discussion, OpenSpec change, or code), then reviews the changes for correctness, spec agreement, doc coverage, the client-side-only invariant, i18n and route wiring, convention adherence, duplicated shapes that want a shared abstraction, hand-rolled complex logic that wants a named/shared function, and unit-test coverage of calculation logic.
disable-model-invocation: true
context: fork
agent: general-purpose
---

# Scoped Code Review

A focused review of a *specific set of changes* — not the whole codebase.
This skill reviews a bounded diff against a chosen source of truth.

Use this skill when the question is "does the change do what was agreed, and
did specs/docs/tests/conventions keep up".

**Precision over recall.** A short report of real problems beats a long one
padded with speculation. Every finding the user dismisses as "not actually a
problem" is a tax on the review. If you are not confident a finding is a real
problem *right now*, drop it. Be skeptical of the code — and equally skeptical
of your own findings before they go in.

## Step 1: Determine scope

What changes are under review. Resolve in this order; stop at the first that
applies:

1. **Explicit ask.** If the user named a scope (a path, a commit range, a PR,
   "the work-time changes", "since v1.5.0"), that is the scope. Use it verbatim.
2. **Discussion context.** If this conversation has been working on a specific
   change, that work is the scope — even if not restated as a review target.
3. **Git, in this order:**
   - On a feature branch (not `master`): scope is the branch —
     `git diff master...HEAD` plus any uncommitted changes.
   - Otherwise, if there are uncommitted changes (`git status --porcelain`
     non-empty): scope is the working tree — `git diff HEAD` (staged +
     unstaged), including untracked files.
   - Otherwise: scope is the last commit — `git show HEAD` /
     `git diff HEAD~1..HEAD`.

State the resolved scope in one line at the top of the report, with the exact
diff command, so the user can confirm you reviewed what they meant. If scope is
genuinely ambiguous (e.g. branch *and* a big pile of unrelated uncommitted
work), ask before reviewing rather than guess.

## Step 2: Determine the source of truth

What the changes are measured *against*. The review's job is to check the change
agrees with its source of truth — so picking the right one matters. Resolve in
this order:

1. **Discussion context.** If the conversation laid out what the change should
   do (a spec, an agreed design, acceptance criteria), that is the source of
   truth. Code and docs are judged against it.
2. **An OpenSpec change.** If `openspec/changes/<id>/` covers the work, that is
   the spec. Read all of it: `proposal.md` for the why, `design.md` for the
   decisions, `specs/<capability>/spec.md` for the requirements and scenarios,
   and `tasks.md` for what was meant to be done. A task checked off with no
   matching code is a finding; so is code that no task asked for. Also read the
   main spec it modifies, `openspec/specs/<capability>/spec.md`.
3. **Code, with docs judged against it.** If the diff is mostly code with no
   OpenSpec change behind it and only scattered doc edits, the **code is the
   source of truth** and the documentation is reviewed *against the code* —
   stale, contradictory, or missing doc updates are findings, not the spec.

State the chosen source of truth in one line in the report. When it's a spec or
discussion, the bar is "does the code do what was promised". When it's code, the
bar is "do the docs (and conventions, and tests) keep up with what the code now
does".

Load the context needed to judge against the source of truth:

- `CLAUDE.md` — commands, project structure, code style, page and route rules.
- `openspec/config.yaml` — the same conventions in the form OpenSpec work reads.
- `README.md` — the outward feature list.
- Whatever spec the source-of-truth decision points at.

## Step 3: Review the changes

Read the full diff for the scope. For non-trivial changes, also open the
surrounding code at each change site — a diff read in isolation hides bugs that
are obvious in context. Check each of the following.

### 3a. Correctness — the changes work, no bugs introduced

- Logic does what it intends; edge cases handled (empty input, `null` /
  `undefined`, zero, negative values, malformed input, off-by-one).
- Parsing and validation reject bad input instead of producing a wrong answer.
  These are validators as much as calculators: hetu, company ID, bank reference,
  UUID, colors, number bases, `HH:mm` times. Check the boundaries — `24:00`,
  `12:60`, an empty string, a value one past the allowed range.
- Number-base and byte-size conversions survive the awkward cases: zero,
  negative numbers, values past `Number.MAX_SAFE_INTEGER`, non-integer input.
- Time arithmetic is explicit about its units and its day boundaries. Minutes
  and hours are not silently mixed, and midnight is resolved deliberately rather
  than by accident.
- Pipeline operations handle both `PipelineData` variants. Text is converted
  through `toText` / `toBinary`, never by assuming the shape. An operation that
  only makes sense on one variant says so instead of producing garbage.
- Binary handling keeps `Uint8Array` intact; no round-trip through a JS string
  that would corrupt non-UTF-8 bytes.
- `async` operation code awaits what it should and propagates failures; a
  rejected operation surfaces an error rather than an empty result.
- React: hook dependency arrays are complete, effects clean up their timers and
  listeners, state updates use the functional form when they read the previous
  value, and nothing derives state that could be computed during render.
- `localStorage` reads go through `app/util/store.ts` and tolerate missing,
  malformed, or older-shaped stored data — a stale value from a previous version
  must not break the page.
- No regressions in adjacent behaviour the change touches.

### 3b. The client-side-only invariant (important)

Everything runs in the browser and nothing the user types reaches a server. That
is the product promise on the front page. Check it holds:

- No new `fetch`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`,
  analytics, or error-reporting call that carries user input off the page.
- The one legitimate network call is the pipeline's user-initiated URL fetch in
  `PipelineInput.tsx`, which pulls data *in* on request. Anything that sends
  data *out* is a high-severity finding.
- No user input written into a URL the browser will send elsewhere, and no
  secret-bearing value put anywhere it could be logged or persisted beyond
  `localStorage`.
- New dependencies do not phone home.

### 3c. Agreement with the source of truth

- Code matches what the spec / docs / discussion promised. Flag every divergence
  — both "code does less than promised" and "code does something the spec didn't
  ask for" (scope creep is a finding too).
- For an OpenSpec change: every requirement and scenario in the delta spec has
  code behind it, and every checked task is actually done.

### 3d. All relevant docs and specs updated

For the behaviour the change introduces or alters, check that **every doc that
should reflect it does**. A user-visible or structural change with no matching
doc update is a finding. When applicable:

- **README.md** — the feature list, when a page or a user-visible capability is
  added, removed, or renamed.
- **CLAUDE.md** — commands, project structure, the page list, the route rules,
  code style, tech stack (when the change alters any of these).
- **openspec/config.yaml** — the `context` block repeats the stack and
  conventions; it goes stale the same way CLAUDE.md does.
- **openspec/specs/<capability>/spec.md** — when the change alters documented
  behaviour of a specified capability outside an OpenSpec change.
- **openspec/changes/<id>/tasks.md** — tasks checked off to match what was done.

Judge *appropriateness* — not every change touches every doc. A pure internal
refactor may need no doc changes at all; a new page usually needs several. Flag
the docs that genuinely should have changed and didn't.

### 3e. i18n and route wiring

These are the two places this repo most often half-updates:

- Every user-facing string goes through `t()` from `LanguageContext`. A literal
  in a component is a finding.
- Every new key exists in **both** `src/app/i18n/fi.ts` and `en.ts`. `fi.ts`
  defines `TranslationKey`, so a key missing from `en.ts` is a type error, but a
  key present in both with an untranslated (copy-pasted Finnish or English)
  value is not — check the wording, not just the key.
- Both Finnish and English translations read naturally and match the tone of
  their neighbours in the table.
- A new page is wired in **both** `src/app/ui/Routes.tsx` (Finnish and English
  paths) and `src/app/i18n/routeMap.ts` (the `PageId`, both paths, and any old
  path kept as an alias). One without the other breaks the language toggle.
- A renamed path keeps the old one as an alias rather than breaking saved links.
- A new page also appears on the index route in `src/app/ui/SinglePageLayout.tsx`
  and in `src/app/ui/layout/Drawer.tsx` (which needs a `nav.*` key in both string
  tables), when it belongs there.

### 3f. Conventions adhered to

Against CLAUDE.md and codebase norms:

- **Calculation logic is pure and React-free.** It belongs in `src/app/calc/`,
  importing nothing from `app/ui` or React. Logic embedded in a page component
  that could live in `calc/` is a finding — that is the code that gets tested.
- **UI** uses shadcn/ui primitives from `components/ui` and Tailwind utility
  classes, composed with `cn()` from `lib/utils`. No raw inline `style` layout,
  no hand-rolled equivalents of an existing primitive. Reuse the local helpers:
  `Section` / `HalfSection`, `Item`, `FlexRow` / `FlexColumn`, `ToolButton`.
- **Icons** come from `lucide-react`.
- **Imports** use the path aliases `app/*`, `lib/*`, `components/*` — not deep
  relative chains. Import order is `simple-import-sort`'s job.
- **Storage** goes through `app/util/store.ts` (`getValue` / `putValue`) with a
  namespaced key, wrapped in a per-feature helper in `app/util/` rather than
  called raw from a component.
- **A new pipeline operation** is registered through `registry.ts` with a unique
  `id`, a `category`, and `defaultParams` when it takes config; render and
  config components attach from the UI layer.
- **Logging** uses `app/util/log.ts`, not bare `console` (`no-console` is a lint
  warning). Debug logging left behind is a finding.
- **Types** are precise. `no-explicit-any` is off in the lint config, so `any`
  passes lint — that makes it a review concern, not a tooling one. Deliberately
  unused variables are prefixed with `_`.
- Formatting is `yarn fix`'s job, not the review's.

### 3g. Duplicated shapes — refactor signal (important)

Check whether the new functionality introduces code that **duplicates a shape
already present elsewhere** in the repo. This is the key signal that a common
shape should be lifted into a shared implementation.

- Search the repo for the same logic or structure the change adds — exact copies
  and near-copies that drifted slightly (the dangerous kind: they diverge into
  bugs).
- Common duplication sites here: a checksum or check-digit routine that
  `app/calc/checks.ts` already covers, a number or date formatter, a linked-input
  hook that `useLinkedInputs` already provides, a storage helper, a page section
  layout, a pipeline operation that differs from an existing one only by a
  parameter.
- List **every** site and propose the unifying abstraction — `app/calc/` for
  logic, `app/util/` for hooks and helpers, `app/ui/component/` for UI.
- Weigh against cognitive load: three short copies a reader holds in their head
  can beat one abstraction chased across four files. Make that call explicitly —
  but a genuine duplicated shape with real divergence risk is a finding, not a
  style nit.
- Check for existing rationale comments explaining why sites are kept separate;
  if the rationale still holds, drop the finding silently.

### 3h. Hand-rolled complex logic — name it / share it (important)

Check that complex calculation, parsing, formatting, or date and time arithmetic
is **not inlined raw** in a component.

- Even at a single use site, this kind of logic deserves a named function in
  `app/calc/` at minimum — both for readability and so it can be unit-tested in
  isolation without a DOM.
- Flag inline blocks of multi-step arithmetic, manual string parsing, regex
  wrangling, or minute/hour math with no name and no test.
- If the logic is generic enough to serve more than its one caller, it belongs
  in the shared module next to its neighbours, not local to the page.

### 3i. Test coverage

- Every calculation or piece of fiddly logic the change adds to `app/calc/` or
  `app/util/` must have a colocated `*.test.ts` covering it. Untested
  calculation logic is a finding even if the code looks correct; "looks correct"
  is exactly what regresses silently.
- Tests cover edge cases, not just the happy path: invalid input, boundaries,
  zero and negative values, empty collections. A validator needs failing inputs
  as well as passing ones.
- Tests use `describe` / `it` / `expect` from vitest and sit next to the source.
- A test needing a DOM has `// @vitest-environment jsdom` on its first line —
  there is no vitest config, so the default environment is node.
- UI is largely untested by design. Do not demand component tests for a page
  change; do flag a page change that *could* have been tested by extracting the
  logic it added (see 3h).

## Step 4: Self-validate before reporting

Run every candidate finding through this filter; drop anything that fails. Do
not pad the report.

- **Read the surrounding context** at the cited lines. Many "issues" evaporate
  once the local context is clear.
- **Look for explanatory comments and commit messages.** If the code is shaped
  this way on purpose (intentional duplication, a deliberate non-abstraction, a
  documented workaround), assess whether the rationale still holds. If it does,
  drop the finding. If not, the finding must say *why* it's stale.
- **Confirm the problem exists today.** "Could be a problem if X" is not a
  finding unless X is real and you confirmed it.
- **Check the fix is actually better.** If a proposed refactor trades one
  complexity for an equal one, drop it.
- **No style-only nits dressed as findings.** Renames, reorderings, and "I'd
  write it differently" are not findings. Formatting is `yarn fix`'s job.
- When a finding turns on whether the code compiles or the suite passes, run
  `yarn lint` or `yarn test` and report what they said rather than guessing.

## Step 5: Report

Open with two lines: the **resolved scope** (with the exact diff command) and
the **chosen source of truth**. Then lead with what's most worth fixing,
grouped:

- **High** — bugs, correctness issues, anything that sends user data off the
  page, code that disagrees with the source of truth, missing docs for a
  user-visible change, untested calculation logic, half-wired i18n or routes.
- **Medium** — duplicated shapes that should be unified, hand-rolled complex
  logic that should be named or moved to `app/calc/`, convention violations,
  stale docs that contradict the code.
- **Low** — minor doc gaps, naming, small cleanups.

**Number every finding** with a severity-class ID so it's easy to refer to
later: `H` / `M` / `L` plus a sequential number within that class (`H1`, `H2`,
`M1`, `L1`, …), numbered from 1 per class in report order. The IDs are local to
this report — a handle for the user, not stable tracker IDs.

Each finding: ``**H1** `path:line` — what's wrong, why it matters now, concrete
fix``. For duplication and extraction findings, list every site and sketch the
target shape. For source-of-truth divergences, cite both the promise and the
code.

Rules:

- No praise. The report is a list of things to change.
- No quotas. A short sharp report beats a long mixed one. Omit a severity group
  when it's genuinely empty.
- This skill reports; it does not edit. The user (or a follow-up pass) makes the
  changes.
