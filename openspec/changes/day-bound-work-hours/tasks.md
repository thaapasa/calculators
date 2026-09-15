## 1. Calculation logic

- [x] 1.1 Read an end time of `00:00` as minute 1440 in `app/calc/worktime.ts`, leaving a
      start time of `00:00` as minute 0, and verify with a unit test that a row of 22:00 to
      `00:00` measures 2 hours and one of `00:00` to `00:00` measures 24 hours
- [x] 1.2 Rewrite `resolveIntervals` to sort rows by start time, drop the midnight wrap,
      and return each row as counted or as an error carrying its reason, verified by tests
      covering an end before its start, a start in the future and an open row whose start
      is later than the current time
- [x] 1.3 Mark a row that starts before the previous counted row ends as an overlap error
      and exclude it, verified by a test where 08:00 to 12:00 and 11:00 to 13:00 give a
      gross total of 4 hours with the second row flagged
- [x] 1.4 Delete `mergeIntervals` and rebuild `summarize` on the validated rows, so the
      gross total is their sum and time away is the gaps between them, verified by the
      existing break-between-rows test and a new rows-meeting-exactly test
- [x] 1.5 Expose each row's error reason from `summarize` for the page to render, verified
      by a test asserting the reason returned for a reversed row and for an overlapping one
- [x] 1.6 Delete `todayKey` and the `date` field from `WorkDay`, and verify `yarn lint-tsc`
      reports no remaining references

## 2. Storage

- [x] 2.1 Stop `app/util/workTimeStorage.ts` comparing dates and always restore the stored
      rows and settings, verified by a test that a stored day loads unchanged and that an
      unknown `date` field on older stored data is ignored

## 3. Translations

- [x] 3.1 Add Finnish and English wording for the two row errors, end not after start and
      overlapping row, to `app/i18n/fi.ts` and `en.ts`, and verify `yarn lint-tsc` accepts
      the translation key type in both tables

## 4. Page

- [x] 4.1 Delete the rollover branch of the tick effect in `app/ui/WorkTimePage.tsx`,
      keeping the tick that refreshes the current time while a row is open, and verify by
      running the page that rows survive a date change
- [x] 4.2 Show rows in start order and render each error row with its reason, verified by
      running the page: a row entered as 13:00 to 12:00 is marked and the totals ignore it
- [x] 4.3 Verify in the running page that a leave-at time past midnight reads as a
      wall-clock time, so a 20:00 start with a 7.5 hour target and lunch shows 04:00

## 5. Tests and checks

- [x] 5.1 Remove the midnight-crossing, interval-merging and future-start-clamp cases from
      `app/calc/worktime.test.ts`, which cover behaviour this change deletes, and confirm
      the remaining suite still describes the intended rules
- [x] 5.2 Run `yarn test` and `yarn lint` and verify both pass

## 6. Review fixes

- [x] 6.1 Count a row whose end equals its start instead of marking it, so a row is not
      erroneous the moment the user clocks in, and verify by tests that a just-started row
      counts as zero length while `00:00` to `00:00` still measures 24 hours
- [x] 6.2 Split the open-row case out as its own error reason, since a row with no end time
      cannot be told its end is before its start, and add the Finnish and English wording
- [x] 6.3 Report a leave-at time only while an open row counts, falling back to the end of
      the last counted row, verified by a test that an overnight open row gives none
- [x] 6.4 Move row ordering into `orderRowsByStart` in `app/calc/worktime.ts` and use it
      from both `resolveIntervals` and the page, verified by unit tests for the helper
- [x] 6.5 Reorder rows when the user leaves a start field rather than on every keystroke,
      so a row does not move mid-edit, verified by a render test
- [x] 6.6 Record the `*.test.tsx` naming and the jsdom opt-in in `CLAUDE.md` and
      `openspec/config.yaml`
