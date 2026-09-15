# work-time Specification

## Purpose

Answers two questions about a single working day. While the user is still working, it
answers "when can I leave?". Once the day is closed, it answers "how many hours did I
clock today?".

The user records start and end times. The calculator subtracts fixed deductions such as
lunch from the total.

## Requirements

### Requirement: Time entry rows

The system SHALL let the user record any number of rows for the day, each with a start
time and an end time. Times SHALL be entered as `HH:mm` on a 24-hour clock, and a
leading zero in the hour MAY be omitted. The system SHALL NOT accept a time outside
those ranges.

#### Scenario: Clocking in

- **WHEN** the user clocks in
- **THEN** a new row is added with the current time as its start and no end time

#### Scenario: Pausing and resuming

- **WHEN** the user pauses and later resumes
- **THEN** every open row is closed at the time of the pause, and resuming opens a new
  row without disturbing the earlier ones

#### Scenario: Removing a row

- **WHEN** the user removes a row
- **THEN** that row no longer counts towards any total

#### Scenario: Out-of-range time

- **WHEN** the user enters `24:00` or `12:60` as a time
- **THEN** the system does not accept it as a valid time

### Requirement: Reading a single row

A row with an empty end time is open, meaning the user is still working. The system
SHALL treat an open row as ending at the current time, and SHALL keep the totals up to
date while the row stays open. A row whose start is in the future SHALL count as zero
length rather than as negative time. The system SHALL ignore a row whose start or end
time it cannot read, and SHALL NOT treat such a row as open.

#### Scenario: Open row counts up to the current time

- **WHEN** a row starts at 08:00, has no end time, and the current time is 10:00
- **THEN** the row contributes 2 hours to the gross total

#### Scenario: Start time in the future

- **WHEN** a row starts at 17:00, has no end time, and the current time is 10:00
- **THEN** the row contributes no time to the gross total

#### Scenario: Unreadable times

- **WHEN** one row has no start time, another has an end time that is not a valid time,
  and a third runs 13:00 to 14:00
- **THEN** the gross total is 1 hour and no row counts as open

### Requirement: Combining rows into totals

The system SHALL add up the time covered by the rows as the gross total, without
counting any minute twice, merging rows that overlap. A closed row whose end is earlier
than its start SHALL be read as crossing midnight. The system SHALL report the time
between rows as time away; time covered by a row, or falling before the first row or
after the last, SHALL NOT count as time away.

#### Scenario: Overlapping rows

- **WHEN** one row runs 08:00 to 12:00 and another runs 11:00 to 13:00
- **THEN** the gross total is 5 hours and the time away is zero

#### Scenario: Break between rows

- **WHEN** one row runs 08:00 to 12:00 and another runs 12:30 to 16:30
- **THEN** the gross total is 8 hours and the time away is 30 minutes

#### Scenario: Row crossing midnight

- **WHEN** a row runs 22:00 to 02:00
- **THEN** the gross total is 4 hours

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

While a row is open, the system SHALL report the time of day at which the target will be
reached. That time SHALL account for deductions in full, including any part not yet
worked off. When no row is open, the system SHALL report the end of the last row
instead. When there are no usable rows, the system SHALL report no leave-at time.

#### Scenario: Open row

- **WHEN** a row starts at 08:00 and is open, the target is 7.5 hours, and the 30 minute
  lunch deduction is on
- **THEN** the leave-at time is 16:00

#### Scenario: Deduction not yet worked off

- **WHEN** a row starts at 08:00 and is open, the current time is 08:10, the target is
  7.5 hours, and the 30 minute lunch deduction is on
- **THEN** the leave-at time is still 16:00, because the full lunch has to be worked off

#### Scenario: All rows closed

- **WHEN** the last row ends at 16:30 and no row is open
- **THEN** the leave-at time is 16:30

#### Scenario: No rows

- **WHEN** the day has no rows
- **THEN** no leave-at time is shown

### Requirement: The day is kept between visits

The system SHALL store the day in the browser and restore it when the user returns. Rows
SHALL belong to the day they were entered on: when the date changes, the system SHALL
discard the rows but keep the lunch, commute and target settings. The system SHALL delay
that rollover while a row is open, so that an entry running past midnight is not lost.

#### Scenario: Returning on the same day

- **WHEN** the user reloads the page on the same day
- **THEN** the rows and settings are as they left them

#### Scenario: Returning on a later day

- **WHEN** the user opens the page on a later date with no row left open
- **THEN** the rows are cleared and the lunch, commute and target settings are kept

#### Scenario: Working past midnight

- **WHEN** the date changes while a row is still open
- **THEN** the rows are kept until the row is closed

#### Scenario: Clearing the day

- **WHEN** the user clears the day
- **THEN** all rows are removed and the settings return to their defaults
