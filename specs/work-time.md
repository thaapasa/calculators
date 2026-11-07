# Work time

A sheet of working hours for one day. While a row is open, the page answers "when can I
leave?". Once every row is closed, it answers "how many hours did I clock?".

The user enters start and end times as local wall-clock times with no date attached.

## Rows

- [x] User can clock in, which adds a row that starts now and stays open.
- [x] User can pause, which closes every open row now, and resume, which opens a new row.
- [x] User can add, edit and remove rows, and close a row by typing its end time.
- [x] Times are `HH:mm` on a 24-hour clock. `00:00` as an end time means the end of the
      day.
- [x] The rows are kept in order of start time. They are reordered when the user has
      finished editing a start time, not while they type it.
- [x] An open row counts up to the current time.
- [x] If a row ends before it starts, crosses midnight or overlaps the row before it, the
      page marks it as an error with the reason and leaves it out of the totals. If the
      page cannot read the times of a row, it ignores the row.

## Totals

- [x] The page shows the gross total of the counted rows, and the time away between
      them.
- [x] The page has a lunch deduction and a commute deduction, and the user can set the
      length of each and turn them on and off. Lunch is on by default.
- [x] The worked total is the gross total minus the deductions, and never goes below
      zero. It is also shown in decimal hours.
- [x] User can set a target for the day, 7.5 hours by default. The page shows the time
      remaining to the target.

## Leave-at time

- [x] While a row is open, the page shows the time of day when the user reaches the
      target. This counts the full deductions from the start, so the time does not move
      as the day goes on. For example, a row open from 08:00 with a 7.5 hour target and
      a 30 minute lunch gives 16:00.
- [x] If no row is open, the leave-at time is the end of the last counted row. If no row
      counts, the page shows no leave-at time.

## Storage

- [x] The rows and settings are stored in the browser and restored when the user comes
      back.
- [x] The stored sheet is not tied to a date. The page never clears it on its own, also
      when the user comes back on a later day.
- [x] User can clear the sheet. This removes all rows and resets the settings to their
      defaults.
