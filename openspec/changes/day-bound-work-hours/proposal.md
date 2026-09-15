## Why

The work time page carries machinery it does not need. It reads a closed row whose end is
before its start as crossing midnight, which exists for overnight shifts but cannot be
told apart from a typo: a row entered as 13:00 to 12:00 counts as 23 hours, and because
overlapping rows are merged, that one row swallows every other row in the day. The total
is wrong and nothing on the page says why.

It also tracks a date, discards the rows when that date changes, and delays the rollover
while a row is open. None of that is needed. The tool works with local wall-clock times,
like a worksheet of time values. The user decides when the sheet is finished, reads the
total, and clears it or edits it into a template for the next day.

## What Changes

- **BREAKING** No row crosses midnight. A row counts only when its end is after its
  start; any other row is marked with the reason and left out of the totals until the
  user corrects it. An overnight shift is two rows rather than one.
- An end time of `00:00` means the end of the day, so a row can run 22:00 to 00:00. A
  start time of `00:00` still means the beginning of the day.
- Rows sort by start time, so a forgotten earlier row moves into place.
- Overlapping rows are marked and excluded instead of being merged. With sorting and this
  rule, `start_n >= end_(n-1)` holds for every row that counts, and interval merging is
  removed.
- A row whose start is in the future is marked as an error rather than counted as zero
  length. This covers an open row left running overnight: on returning the next day the
  row reads as invalid, and the user closes it by entering the end time.
- **BREAKING** Nothing clears itself. The stored rows are no longer tied to a date, the
  day rollover is gone, and the page no longer distinguishes today from any other day.
  Rows stay until the user edits or clears them.
- A leave-at time that falls after midnight is shown as a wall-clock time, so a target
  reached at half past three in the morning reads as 03:30.

## Capabilities

### New Capabilities

None. This change modifies existing behaviour.

### Modified Capabilities

- `work-time`: removing the midnight-crossing rule, the interval merge and all automatic
  clearing; adding row-level errors, sorting by start time, and an end time of `00:00`
  meaning the end of the day.

## Impact

- `src/app/calc/worktime.ts` — `resolveIntervals` loses the midnight wrap and gains
  validation, `mergeIntervals` is deleted, `summarize` reports per-row errors, and
  `todayKey` goes.
- `src/app/ui/WorkTimePage.tsx` — the rollover tick effect is deleted and rows render an
  error state.
- `src/app/util/workTimeStorage.ts` — the stored day loses its `date` field, and with it
  the load-time date comparison.
- `src/app/calc/worktime.test.ts` — the midnight-crossing, merge and future-start tests
  cover behaviour that is being removed.
- `src/app/i18n/fi.ts` and `en.ts` — the row errors need Finnish and English wording.
