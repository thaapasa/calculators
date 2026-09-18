# Spec delegation plan

How to write the missing specs for this repo, and which parts to hand to an AI agent.

## Where we start

The repo has ten pages and one spec. `openspec/specs/work-time/spec.md` came out of the
`day-bound-work-hours` change, so it was written before the code it describes. Every
remaining spec has to be written from code that already exists.

These specs record intent, not implementation. Where the code does something the intent
does not call for, the spec states the intent and the code gets fixed.

## Why intent-first makes this delegable

An agent reading `src/app/calc/hetu.ts` sees only what the code does. Ask it to describe
the code and it writes `getRandomInt(1, 29)` down as a requirement. The shortcut becomes
law.

Most calculators here follow a public standard. The intent lives in that standard, so the
agent can read the standard instead of guessing from the code. Eight of the thirteen
capabilities below work this way.

So the agent's job is to research the standard and compare it against the code. It is not
to describe the code.

## The work-time spec is not the template

`work-time` spends most of its 237 lines on the user interface. For that page the
interface is the answer, so this is correct. It is also why it does not transfer.

Colors, byte sizes, pixel density and numbers share one interface mechanism:
`useLinkedInputs`. You type in any field and the others follow. Spec that mechanism once,
as its own capability. Those four page specs then say nothing about the interface. They
become short conversion contracts.

Use this rule to decide whether a scenario belongs in a spec. Include it if getting it
wrong gives a wrong answer. Leave it out if it only gives a worse experience.
`rgb(255, 0, 0)` maps to `#ff0000` is a scenario. "Typing in the hex field updates the RGB
fields" is not.

## The capability list

Specs are shaped around the calculation, not the page. The boundaries differ from the
route list in `src/app/i18n/routeMap.ts`.

| Capability | Source of intent | Drafts | Notes |
| --- | --- | --- | --- |
| `linked-inputs` | Your design | You | Exemplar. Four other specs depend on it. Tested. |
| `number-bases` | Positional notation | Agent | `numbers.ts`, tested |
| `byte-sizes` | IEC 60027-2, SI prefixes | Agent | Logic sits inline in `ByteSizesPage.tsx` |
| `pixel-density` | Android and iOS density buckets | Agent | Table sits inline in `PixelDensityPage.tsx` |
| `cryptography` | Hash algorithm definitions | Agent | Tested |
| `colors` | sRGB and HSL conversion | Agent, you resolve | Untested. See the 255/256 split and `HSLMaxValue = 719` |
| `identifiers` | DVV hetu rules, mod 11, 7-3-1, Luhn, UUID | Agent, you resolve | Untested. Expect the longest delta list |
| `time-conversion` | Unix and Java epochs, ISO 8601 weeks | Agent, you resolve | Untested. Name days are external data |
| `pipeline-operations` | RFC 4648, RFC 9535, hash and compression specs | Agent, you resolve | Tested |
| `pipeline-model` | Your design | You | Step chaining, config, persistence, ordering |
| `links` | Your design | You | About ten lines of logic |
| `localization-and-routing` | Your design | You | Finnish and English paths, old aliases |
| `client-side-only` | Your design | You | Constrains features that do not exist yet |

Eight capabilities go to an agent. Five stay with you, and four of those are small.

## The loop for each delegated capability

Four steps. The agent does steps 1 and 4. You do steps 2 and 3.

**1. The agent drafts two files, never one.** The first is
`openspec/specs/<capability>/spec.md`, written as intent. Where the standard is clear, the
spec states the standard, even if the code disagrees. The second is
`openspec/changes/<capability>-spec/deltas.md`, listing every point where the code differs
from the spec, and every point where the agent could not derive intent. Each entry cites
`file:line`, says what the spec requires, says what the code does, and recommends a
resolution.

**2. You resolve the deltas.** Give each entry one of three verdicts. A *bug* gets fixed.
A *deliberate limit* goes into the spec as an explicit boundary. *Out of scope* means the
spec says nothing about it. This step needs your full attention. It is also the only one
that does, because you are answering a list of concrete questions with code references
attached, not reading a spec closely.

**3. You skim the spec against your verdicts.**

**4. The agent opens one OpenSpec change per capability**, bundling that capability's bugs.
It implements the fixes, writes tests, and runs `yarn test` and `yarn lint`.

## Every scenario maps to a test

Require the agent to pin each scenario to a test, existing or new. A passing test confirms
the code already matches the intent. A failing one is a bug, and the list of failures is
the delta list in executable form.

This also gives `identifiers`, `colors` and `time-conversion` the test coverage they have
never had.

## Handling the bugs

Open one change per capability as soon as its spec lands. Do not build a backlog. Between
the spec landing and the fix landing, `openspec/specs/` describes behaviour the code does
not have, so keep that window to hours rather than weeks.

## Order of work

**Batch 0, yours.** Delete `src/app/ui/TextConversionPage.tsx`, which nothing imports.
Then write `linked-inputs` yourself.

**Batch 1, one agent.** `identifiers`. This is the calibration run. The standards are
public and unambiguous, the code has not changed since 2018, and it will produce the
longest delta list in the repo. Read that list closely and tune the prompt before you fan
out.

**Batch 2, parallel agents.** `number-bases`, `byte-sizes`, `pixel-density`,
`cryptography`. Small, well bounded, few deltas. You can skim these.

**Batch 3, sequential agents.** `colors`, then `time-conversion`, then
`pipeline-operations`. Each holds real decisions, so do not run them at once.

**Batch 4, yours.** `pipeline-model`, `links`, `localization-and-routing`,
`client-side-only`.

## What you keep, and why

`client-side-only` is the most important spec in the repo and an agent cannot write it. No
code states the rule. It constrains features that do not exist yet, so there is nothing to
read.

`pipeline-model` is your design. Why steps chain the way they do, what persists, and what
a user expects after a reload are not recoverable from the code.

`localization-and-routing` carries history only you remember. The aliases `/p/merkit` and
`/p/bytesize` exist for reasons the code does not record, and the Finnish and English paths
for `numbers` differ (`/p/numerot` against `/p/symbols`) in a way that looks deliberate but
cannot be derived.

Every verdict in every `deltas.md` is yours. That is the whole point of splitting the
drafting from the deciding.
