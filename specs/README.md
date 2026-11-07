# Specs

Requirements for the app, one file per area. Agents use these files for feature
planning and implementation.

Each file has a heading, a short description of the area and a list of
requirements:

- `- [ ]` means planned.
- `- [x]` means implemented.

Keep requirements at the level of what a user or caller can do. Leave
implementation details to the code. When a requirement depends on another
area, link to that area's file.

A file can have a "Known issues" section for bugs that are found but not fixed.
List each one as an unchecked item, and say what the correct behaviour is. Tick the
item when the bug is fixed, or move it into the requirements.

A file can end with an "Open questions" section for decisions that are not made
yet.

## Areas

Each card on the main page has its own file. [Common behaviour](common.md) covers what
the cards share, such as the last value in the top bar.

- [Time](time.md): one moment in time as a date, timestamps, the week and name days.
- [Work time](work-time.md): the sheet of working hours, with deductions, a target
  and the leave-at time.
- [Colors](colors.md): conversions between hex, RGB and HSL, and stored colors.
- [Identifiers](identifiers.md): Finnish identity codes, bank references, company IDs,
  check digits, random strings and UUIDs.
- [Pixel density](pixel-density.md): image sizes across Android and iOS screen densities.
- [Numbers](numbers.md): number bases and character codes.
- [Byte sizes](byte-sizes.md): data sizes in binary and decimal units.
- [Text conversions](text-conversions.md): a pipeline of encoding, format, hash and
  compression steps.
- [Links](links.md): a stored list of links.
