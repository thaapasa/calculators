# Time

Shows one moment in time in several formats at once. The user can edit the moment in
any of the editable formats, and the page updates the others.

When the page opens, it shows the current time in the time zone of the browser.

## Editing the moment

- [x] User can edit the date and the time of day as separate fields: date, hours,
      minutes, seconds and milliseconds. The date uses the Finnish format, such as
      `31.12.2016`.
- [x] User can enter the moment as an ISO 8601 timestamp, either in local time with an
      offset or in UTC.
- [x] User can enter the moment as milliseconds since the epoch (Java time) or as seconds
      since the epoch (Unix time).
- [x] When the user edits one field, the other fields update. The field the user is
      typing in keeps the text as typed.
- [x] If the input does not form a valid moment, the other fields are left empty.

## Derived values

- [x] The page shows the day of the week, the ISO week as `year/week`, and the time zone
      offset. These fields are read-only.
- [x] The page shows the Finnish name days of the date.
- [x] User can search for a name. The search suggests matching names with their name
      days, and picking one moves the date to that day in the current year. The time of
      day stays as it was.

## Copying values

- [x] When the user focuses the date, week, name day or one of the timestamp fields, its
      value goes to the last-value field in the top bar. Later edits keep updating it in
      that format.
- [x] The card subtitle names the format of the focused field.
