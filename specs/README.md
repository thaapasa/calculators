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

A file can end with an "Open questions" section for decisions that are not made
yet.

## Areas

- [Work time](work-time.md): the sheet of working hours, with deductions, a target
  and the leave-at time.
