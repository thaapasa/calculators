# work-time Specification

## Purpose

Answers two questions about a sheet of working hours. While a row is open, it answers
"when can I leave?". Once every row is closed, it answers "how many hours did I clock?".

The user records start and end times as local wall-clock times with no date attached. The
calculator subtracts fixed deductions such as lunch from the total. The sheet stays until
the user clears it.

## Requirements

### Requirement: Time entry rows

The system SHALL let the user record any number of rows, each with a start time and an
end time. Times are local wall-clock times with no date attached, entered as `HH:mm` on
a 24-hour clock. An end time of `00:00` SHALL mean the end of the day; a start time of
`00:00` SHALL mean its beginning. The system SHALL keep the rows in order of start time,
reordering them once the user has finished editing a start time rather than while it is
being typed, and SHALL mark a row it cannot count with the reason for it.

#### Scenario: Clocking in

- **WHEN** the user clocks in
- **THEN** a new row is added with the current time as its start and no end time

#### Scenario: Pausing and resuming

- **WHEN** the user pauses and later resumes
- **THEN** every open row is closed at the time of the pause, and resuming opens a new
  row without disturbing the earlier ones

#### Scenario: Closing a row by entering its end time

- **WHEN** the user types an end time into an open row
- **THEN** the row is closed at that time, without the user having to press pause

#### Scenario: Removing a row

- **WHEN** the user removes a row
- **THEN** that row no longer counts towards any total

#### Scenario: Out-of-range time

- **WHEN** the user enters `24:00` or `12:60` as a time
- **THEN** the system does not accept it as a valid time

#### Scenario: Ending at midnight

- **WHEN** a row runs 22:00 to `00:00`
- **THEN** the row counts as 2 hours

#### Scenario: Adding a forgotten earlier row

- **WHEN** the user adds a row starting at 08:00 below a row starting at 13:00
- **THEN** the rows are shown in start order, with the 08:00 row first

### Requirement: Reading a single row

A row with an empty end time is open, meaning the user is still working, and the system
SHALL treat it as ending at the current time. A row SHALL count unless its end falls
before its start. A row that starts and ends at the same time SHALL count and contribute
nothing. The system SHALL mark any other row as an error, with the reason, and leave it
out of the totals until the user corrects it. The system SHALL ignore a row whose times
it cannot read.

#### Scenario: Open row counts up to the current time

- **WHEN** a row starts at 08:00, has no end time, and the current time is 10:00
- **THEN** the row contributes 2 hours to the gross total

#### Scenario: Row that has just started

- **WHEN** the user clocks in at 10:00 and the current time is still 10:00
- **THEN** the row counts and contributes no time yet

#### Scenario: Start time in the future

- **WHEN** a row starts at 17:00, has no end time, and the current time is 10:00
- **THEN** the row is marked as an error, because its start has not arrived yet

#### Scenario: Open row left running overnight

- **WHEN** a row starts at 22:00, has no end time, and the user returns at 09:00 the next
  morning
- **THEN** the row is marked as an error, and entering an end time makes it count again

#### Scenario: Unreadable times

- **WHEN** one row has no start time, another has an end time that is not a valid time,
  and a third runs 13:00 to 14:00
- **THEN** the gross total is 1 hour and no row counts as open

#### Scenario: End before start

- **WHEN** a row runs 13:00 to 12:00 and another runs 08:00 to 12:00
- **THEN** the first row is marked as an error, and the gross total is 4 hours

### Requirement: Combining rows into totals

The system SHALL add up the time covered by the counted rows as the gross total. No row
SHALL cross midnight. Rows SHALL NOT overlap: where a row starts before the previous row
ends, the system SHALL mark it as an error and leave it out of the totals. The system
SHALL report the time between counted rows as time away; time covered by a row, or
falling before the first row or after the last, SHALL NOT count as time away.

#### Scenario: Overlapping rows

- **WHEN** one row runs 08:00 to 12:00 and another runs 11:00 to 13:00
- **THEN** the second row is marked as an error, and the gross total is 4 hours

#### Scenario: Rows meeting exactly

- **WHEN** one row runs 08:00 to 12:00 and another runs 12:00 to 16:00
- **THEN** both rows count, the gross total is 8 hours, and the time away is zero

#### Scenario: Break between rows

- **WHEN** one row runs 08:00 to 12:00 and another runs 12:30 to 16:30
- **THEN** the gross total is 8 hours and the time away is 30 minutes

#### Scenario: Row crossing midnight

- **WHEN** a row runs 22:00 to 02:00
- **THEN** the row is marked as an error rather than counted as 4 hours

### Requirement: Deductions and the target day

The system SHALL offer a lunch and a commute deduction, each with a length the user can
set. Lunch defaults to 30 minutes and is on, commute to 30 minutes and is off. The
worked total is the gross total minus the deductions that are on. It SHALL never fall
below zero, and SHALL also be shown in decimal hours to two places. The user SHALL be
able to set a target for the day, defaulting to 7.5 hours, and the system SHALL report
the time remaining against it, or zero once reached.

#### Scenario: Lunch subtracted once

- **WHEN** the gross total is 8 hours and the 30 minute lunch deduction is on
- **THEN** the worked total is 7 hours 30 minutes and no time remains against a 7.5 hour
  target

#### Scenario: Both deductions on

- **WHEN** the gross total is 2 hours and both the 30 minute lunch and the 30 minute
  commute deductions are on
- **THEN** the worked total is 1 hour

#### Scenario: Deduction larger than the time worked

- **WHEN** the gross total is 10 minutes and the 30 minute lunch deduction is on
- **THEN** the worked total is zero rather than a negative time

#### Scenario: Lunch turned off

- **WHEN** the gross total is 2 hours and the lunch deduction is off
- **THEN** the worked total is 2 hours and 5 hours 30 minutes remain against a 7.5 hour
  target

#### Scenario: Target already passed

- **WHEN** the worked total is 8 hours against a 7.5 hour target
- **THEN** the time remaining is zero rather than a negative time

### Requirement: Leave-at time

While an open row counts, the system SHALL report the time of day at which the target
will be reached. That time SHALL account for deductions in full, including any part not
yet worked off. When the target falls after midnight, the system SHALL show it as a
wall-clock time. Otherwise the system SHALL report the end of the last counted row, and
when no row counts, no leave-at time at all.

#### Scenario: Open row

- **WHEN** a row starts at 08:00 and is open, the target is 7.5 hours, and the 30 minute
  lunch deduction is on
- **THEN** the leave-at time is 16:00

#### Scenario: Deduction not yet worked off

- **WHEN** a row starts at 08:00 and is open, the current time is 08:10, the target is
  7.5 hours, and the 30 minute lunch deduction is on
- **THEN** the leave-at time is still 16:00, because the full lunch has to be worked off

#### Scenario: Target reached after midnight

- **WHEN** a row starts at 20:00 and is open, the target is 7.5 hours, and the 30 minute
  lunch deduction is on
- **THEN** the leave-at time is shown as 04:00

#### Scenario: Open row that does not count

- **WHEN** the only row starts at 22:00, has no end time, and the current time is 09:00
- **THEN** no leave-at time is shown

#### Scenario: All rows closed

- **WHEN** the last row ends at 16:30 and no row is open
- **THEN** the leave-at time is 16:30

#### Scenario: No rows

- **WHEN** the sheet has no rows
- **THEN** no leave-at time is shown

### Requirement: The sheet persists until cleared

The system SHALL store the rows and settings in the browser and restore them when the
user returns. The stored data SHALL NOT be tied to a date, and the system SHALL NOT
clear, discard or alter it on its own. Rows SHALL stay as they are until the user edits
or clears them.

#### Scenario: Returning on the same day

- **WHEN** the user reloads the page on the same day
- **THEN** the rows and settings are as they left them

#### Scenario: Returning on a later day

- **WHEN** the user opens the page on a later date
- **THEN** the rows and settings are still as they left them, and nothing marks them as
  belonging to an earlier day

#### Scenario: Clocking in with earlier rows still present

- **WHEN** the user clocks in while rows from an earlier day are still on the sheet
- **THEN** the new row joins them, and their hours count towards the same totals

#### Scenario: Working past midnight

- **WHEN** a row is still open as the clock passes midnight
- **THEN** the sheet is left as it is, with nothing cleared, discarded or rewritten

#### Scenario: Clearing the sheet

- **WHEN** the user clears the sheet
- **THEN** all rows are removed and the settings return to their defaults
