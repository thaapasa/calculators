# Work time

A sheet of working hours for one day. While a row is open, the page answers "when can I
leave?". Once every row is closed, it answers "how many hours did I clock?".

The user enters start and end times as local wall-clock times with no date attached. The
sheet is stored in the browser and stays until the user clears it.

## Rows

- [x] User can clock in. This adds a row with the current time as its start and no end
      time.
- [x] User can pause and resume. Pausing closes every open row at the current time.
      Resuming opens a new row and leaves the earlier rows as they are.
- [x] User can close an open row by typing its end time, without pressing pause.
- [x] User can add and remove rows. A removed row does not count towards any total.
- [x] Times are entered as `HH:mm` on a 24-hour clock. Values such as `24:00` or `12:60`
      are not valid times.
- [x] An end time of `00:00` means the end of the day, and a start time of `00:00` means
      its beginning. A row from 22:00 to `00:00` counts as 2 hours.
- [x] The rows are kept in order of start time. If the user adds a forgotten 08:00 row
      below a 13:00 row, the 08:00 row moves first. The rows are reordered when the user
      has finished editing a start time, not while they type it.

## Reading a row

- [x] A row with no end time is open, and counts up to the current time.
- [x] A row that starts and ends at the same time counts and adds no time. This covers a
      row that the user has just clocked in.
- [x] If the end of a row falls before its start, the row is marked as an error with the
      reason, and it does not count until the user fixes it. This covers an open row
      whose start is still in the future, and an open row left running overnight.
- [x] If the page cannot read the times of a row, such as a missing start time, it
      ignores the row.

## Totals

- [x] The gross total is the time covered by the rows that count.
- [x] No row crosses midnight. A row from 22:00 to 02:00 is marked as an error, not
      counted as 4 hours.
- [x] Rows do not overlap. If a row starts before the previous row ends, it is marked as
      an error and left out of the totals. Rows that meet exactly, such as 08:00–12:00
      and 12:00–16:00, both count.
- [x] The page shows the time between counted rows as time away. Time before the first
      row or after the last row is not time away.

## Deductions and target

- [x] The page has a lunch deduction and a commute deduction, and the user can set the
      length of each. Lunch is 30 minutes and on by default. Commute is 30 minutes and
      off by default.
- [x] The worked total is the gross total minus the deductions that are on. It never goes
      below zero.
- [x] The page also shows the worked total in decimal hours, to two decimals.
- [x] User can set a target for the day. The default is 7.5 hours.
- [x] The page shows the time remaining to the target, or zero once the target is
      reached.

## Leave-at time

- [x] While an open row counts, the page shows the time of day when the user reaches the
      target. For example, a row open from 08:00 with a 7.5 hour target and a 30 minute
      lunch gives 16:00.
- [x] The leave-at time includes the full deductions, also the part the user has not yet
      worked off. In the example above, the time is 16:00 also at 08:10.
- [x] If the target falls after midnight, the page shows it as a wall-clock time, such as
      04:00.
- [x] If no row is open, the leave-at time is the end of the last counted row.
- [x] If no row counts, the page shows no leave-at time.

## Storage

- [x] The rows and settings are stored in the browser and restored when the user comes
      back.
- [x] The stored sheet is not tied to a date. The page never clears, drops or changes it
      on its own, also when the user comes back on a later day or works past midnight.
- [x] If the user clocks in while rows from an earlier day are on the sheet, the new row
      joins them and all of them count towards the same totals.
- [x] User can clear the sheet. This removes all rows and resets the settings to their
      defaults.
