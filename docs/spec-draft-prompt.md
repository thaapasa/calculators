# Agent prompt for drafting a spec

Use this once per delegated capability. Copy everything below the line, replace
`<CAPABILITY>` and `<SOURCE FILES>` from the table in
[spec-delegation-plan.md](spec-delegation-plan.md), and paste it into a fresh session.

Revise this file after the `identifiers` run. That run exists to find out what the prompt
gets wrong.

---

Draft the OpenSpec specification for the `<CAPABILITY>` capability of this repo. The
relevant code is in `<SOURCE FILES>`.

## What a spec means here

A spec records **intent**: what this calculator is supposed to do and why. It does not
record what the code currently does.

Where the code and the intent disagree, the spec states the intent. The difference is a
bug, and you report it separately. Do not soften a requirement to match the
implementation.

## Read these first

- `openspec/config.yaml` for project conventions.
- `openspec/specs/linked-inputs/spec.md` for how long a spec should be and what belongs in
  one.
- `openspec/specs/work-time/spec.md` for the OpenSpec format only: `### Requirement:`,
  SHALL wording, `#### Scenario:` with WHEN and THEN. Ignore its length and its scope. It
  describes a page whose interface is the product. Most capabilities here are calculations,
  and their specs are much shorter.

## Find the real source of intent

Most calculators here implement a public standard. Find it, read it, and cite it by name
and section in the spec. The standard is your source of truth, not the code.

Where no standard applies, the intent comes from the tests. Where neither exists, you do
not know the intent, and it goes in the delta list as a question.

## Deliverable 1: `openspec/specs/<CAPABILITY>/spec.md`

Requirements and scenarios, stating intent.

Include a scenario if getting it wrong produces a wrong answer. Leave it out if it only
produces a worse experience. Worked examples with real values make good scenarios, because
they become test cases.

Say nothing about linked input fields. `linked-inputs` covers that, and repeating it here
is wrong.

## Deliverable 2: `openspec/changes/<CAPABILITY>-spec/deltas.md`

Every point where the code differs from the spec, and every point where you could not
derive the intent. This file matters as much as the spec.

One entry each, in this shape:

> **Short title.** `path/to/file.ts:12` does X. The spec requires Y, because <standard,
> section>. Recommend: bug / deliberate limit / out of scope, and what to do.

Always cite `file:line`. Always recommend a resolution. Do not ask a bare question.

Anything that looks arbitrary goes here, not into the spec. A hardcoded range, a magic
constant, an off-by-one between two related numbers: report it, do not write it up as a
rule.

## Map every scenario to a test

List, for each scenario, the test that proves it. Use existing tests in
`*.test.ts` where they fit and write new ones where they do not. Put new tests next to the
source file, following the conventions in `openspec/config.yaml`.

A failing test is expected here. It means the code does not match the intent, so add it to
`deltas.md` and leave it failing.

## Do not change the implementation

Write the spec, the delta list and the tests. Do not fix any bug you find in this session.
The fixes happen in a separate change, after the delta list is reviewed.

## Before you finish

Run `yarn test` and `yarn lint`. Then report:

1. The standard you used, and where you found it.
2. How many deltas you found, and which one matters most.
3. Anything you could not determine.
