## Context

See proposal.md for the motivation. The current implementation resolves each row into a
minute interval, wrapping an end that falls before its start into the next day, then
merges overlapping intervals before summing. The page stores one day under
`calculators:work-day`, keyed by date, and a timer discards the rows when the date
changes unless a row is open.

## Goals / Non-Goals

**Goals**

- One rule decides whether a row counts: its end is after its start.
- A row that does not count says why, on the row.
- No clock-driven behaviour beyond keeping an open row's elapsed time fresh.

**Non-Goals**

- Recording more than one day at a time. The user keeps or clears the sheet themselves.
- Any notion of date, calendar or time zone in stored data.
- Warning the user that the sheet is from an earlier day. Decided against: the tool holds
  wall-clock times and does not know what day they belong to.

## Decisions

**Validation replaces merging.** `mergeIntervals` is deleted. Rows are sorted by start
time, then walked once: a row whose start falls before the previous counted row's end is
marked as an error and skipped. What remains is by construction ordered and disjoint, so
the gross total is a plain sum and time away is the sum of the gaps between consecutive
counted rows.

Alternative considered: keep merging and only drop the midnight wrap. Rejected because
merging is what let one bad row absorb the others, and a merged row cannot be pointed at
in the UI when something looks wrong.

**An end time of `00:00` means minute 1440.** The rows use `<input type="time">`, whose
value must be a valid HTML time string with an hour of 00 to 23, so `24:00` cannot be
entered or set. Supporting `24:00` would mean replacing the control with a text input and
hand-rolling parsing, losing the native picker on phones, locale-aware display and
built-in validation.

The rule is positional and has no exceptions: as a start, `00:00` is minute 0; as an end,
it is minute 1440. A row of `00:00` to `00:00` is therefore the whole day. Internally
every row stays a pair of integers in 0..1440 with `start < end`.

**The date is removed, not ignored.** `todayKey()`, the `date` field on the stored day
and the rollover effect are deleted rather than left unused, so nothing can grow back a
dependency on them. `WorkDay` keeps only the rows and the deduction and target settings.

**An open row is validated by the same rule.** An open row ends at the current time, so
`start < now` decides it, exactly as for a closed row. A start in the future and a row
left open past midnight both become errors through that one rule, with no special case
for either. The existing clamp that gave a future-dated row zero length is removed.

**Errors are per row and carry a reason.** `summarize` returns, alongside the totals, a
reason for each row it did not count: the end is not after the start, or the row overlaps
the one before it. The page renders that on the row. The reasons need Finnish and English
wording in `app/i18n`.

## Risks / Trade-offs

**Hours worked after midnight are not captured by the open row** → The user closes the
row at the end of the day and adds a row for the hours after midnight. Accepted: the tool
holds one sheet of wall-clock times, and spanning two days is what this change removes.

**A stored day from before the change may contain a row that crossed midnight** → It
loads and shows as an error with its reason, which is the same state a user reaches by
mistyping. No data is discarded and the user fixes or removes the row.

**Rows no longer disappear overnight** → Someone used to opening the page to an empty
sheet will find yesterday's rows waiting. This is the intended behaviour, but it is the
most visible change for an existing user, and clocking in will append to the old rows.

## Migration Plan

The stored value at `calculators:work-day` keeps its key and loses its `date` field.
`loadWorkDay` stops comparing dates and restores the rows whatever they are; an unknown
`date` field on stored data is ignored and dropped on the next write. Nothing needs to be
migrated ahead of time and there is no rollback concern, since an older build reading the
new shape finds no `date`, treats the day as stale and starts empty, which is what that
build already does.
