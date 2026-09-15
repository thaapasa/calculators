## 1. Calculation logic

- [ ] 1.1 Read an end time of `00:00` as minute 1440 in `app/calc/worktime.ts`, leaving a
      start time of `00:00` as minute 0, and verify with a unit test that a row of 22:00 to
      `00:00` measures 2 hours and one of `00:00` to `00:00` measures 24 hours
- [ ] 1.2 Rewrite `resolveIntervals` to sort rows by start time, drop the midnight wrap,
      and return each row as counted or as an error carrying its reason, verified by tests
      covering an end before its start, a start in the future and an open row whose start
      is later than the current time
- [ ] 1.3 Mark a row that starts before the previous counted row ends as an overlap error
      and exclude it, verified by a test where 08:00 to 12:00 and 11:00 to 13:00 give a
      gross total of 4 hours with the second row flagged
- [ ] 1.4 Delete `mergeIntervals` and rebuild `summarize` on the validated rows, so the
      gross total is their sum and time away is the gaps between them, verified by the
      existing break-between-rows test and a new rows-meeting-exactly test
- [ ] 1.5 Expose each row's error reason from `summarize` for the page to render, verified
      by a test asserting the reason returned for a reversed row and for an overlapping one
- [ ] 1.6 Delete `todayKey` and the `date` field from `WorkDay`, and verify `yarn lint-tsc`
      reports no remaining references

## 2. Storage

- [ ] 2.1 Stop `app/util/workTimeStorage.ts` comparing dates and always restore the stored
      rows and settings, verified by a test that a stored day loads unchanged and that an
      unknown `date` field on older stored data is ignored

## 3. Translations

- [ ] 3.1 Add Finnish and English wording for the two row errors, end not after start and
      overlapping row, to `app/i18n/fi.ts` and `en.ts`, and verify `yarn lint-tsc` accepts
      the translation key type in both tables

## 4. Page

- [ ] 4.1 Delete the rollover branch of the tick effect in `app/ui/WorkTimePage.tsx`,
      keeping the tick that refreshes the current time while a row is open, and verify by
      running the page that rows survive a date change
- [ ] 4.2 Show rows in start order and render each error row with its reason, verified by
      running the page: a row entered as 13:00 to 12:00 is marked and the totals ignore it
- [ ] 4.3 Verify in the running page that a leave-at time past midnight reads as a
      wall-clock time, so a 20:00 start with a 7.5 hour target and lunch shows 04:00

## 5. Tests and checks

- [ ] 5.1 Remove the midnight-crossing, interval-merging and future-start-clamp cases from
      `app/calc/worktime.test.ts`, which cover behaviour this change deletes, and confirm
      the remaining suite still describes the intended rules
- [ ] 5.2 Run `yarn test` and `yarn lint` and verify both pass
