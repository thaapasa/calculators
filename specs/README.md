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

- [Colors](colors.md): conversions between hex, RGB and HSL.
- [Identifiers](identifiers.md): Finnish identity codes, bank references, company IDs
  and check digits.
- [Work time](work-time.md): the sheet of working hours, with deductions, a target
  and the leave-at time.
