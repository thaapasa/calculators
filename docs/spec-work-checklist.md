# Spec work: what to do, in order

Working notes for the plan in [spec-delegation-plan.md](spec-delegation-plan.md). Start
here.

## Do these two things first

Nothing else can start until both are done.

**Delete `src/app/ui/TextConversionPage.tsx`.** Nothing imports it. `PipelinePage` serves
`/p/tekstimuunnokset` and `/p/textconversions`. Delete it so nobody writes a spec for dead
code.

**Write `openspec/specs/linked-inputs/spec.md` yourself.** Four later specs depend on it,
and writing it is how you set the house style for specs written after the code.

Write it about `src/app/util/useLinkedInputs.ts`, using `useLinkedInputs.test.ts` as the
record of what you already decided. Cover the canonical value model, what happens to a
field while the user is typing in it, and what an unparseable entry does. Keep it short.

Once it exists, it replaces `work-time` as the example you hand to agents.

## Reviewing what an agent gives you

You get two files back. Read `deltas.md` closely and skim `spec.md`.

A delta entry is good when you can rule on it without opening the repo. It should look
like this:

> **`generate()` never produces the 29th to 31st.** `src/app/calc/hetu.ts:29` calls
> `getRandomInt(1, 29)` for the day, so no generated hetu falls on those days. A
> `// TODO: Use a date lib to generate all dates` sits above it. The spec requires a valid
> calendar date. Recommend: bug, generate a real date.

Send it back if it is missing the `file:line`, or if it asks you a question without
recommending an answer.

Three things to watch for in the spec itself:

- A requirement whose only evidence is the implementation. If no standard and no test
  backs it, it belongs in `deltas.md` as a question.
- Interface scenarios that `linked-inputs` already covers.
- An arbitrary looking constant quietly written up as a rule.

## Deltas already found

Seed the first agent with these so it does not spend time rediscovering them.

**`identifiers`**

- `src/app/calc/hetu.ts:29` generates days 1 to 28 only, and months via
  `getRandomInt(1, 13)`. There is a TODO admitting it.
- `src/app/calc/hetu.ts:10` never checks that the date part is a real date. `319999-123`
  gets a check character.
- `src/app/calc/hetu.ts:29` and `src/app/calc/bankreference.ts:5` both return a value
  without its check digit. The page appends the check separately. Decide whether that is
  the intent and state it, because nothing in the code says so.

**`colors`**

- `src/app/calc/colors.ts:32` divides by 255 and `colors.ts:40` multiplies by 256. One of
  the two is wrong.
- `src/app/calc/colors.ts:21` sets `HSLMaxValue = 719`. Decide whether that is the colour
  model or an artefact of the slider.

## Git history is only useful for the newer files

`colors.ts`, `time.ts` and `worktime.ts` have recent, meaningful commits. `hetu.ts` and
`companyid.ts` have not had a behaviour change since 2018 and 2017, and every commit since
is a reformat. Do not expect history to recover intent for the identifier code.

## Progress

| Capability | Spec | Deltas resolved | Bugs fixed |
| --- | --- | --- | --- |
| `linked-inputs` | | | |
| `identifiers` | | | |
| `number-bases` | | | |
| `byte-sizes` | | | |
| `pixel-density` | | | |
| `cryptography` | | | |
| `colors` | | | |
| `time-conversion` | | | |
| `pipeline-operations` | | | |
| `pipeline-model` | | | |
| `links` | | | |
| `localization-and-routing` | | | |
| `client-side-only` | | | |

## Running the batches

Batch 1 is `identifiers`, on its own. It is the calibration run. Read its delta list in
full, then change [spec-draft-prompt.md](spec-draft-prompt.md) before starting anything
else.

Batch 2 is `number-bases`, `byte-sizes`, `pixel-density` and `cryptography`. Run these in
parallel.

Batch 3 is `colors`, then `time-conversion`, then `pipeline-operations`. Run these one at a
time.

Batch 4 is yours: `pipeline-model`, `links`, `localization-and-routing` and
`client-side-only`.
