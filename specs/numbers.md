# Numbers

Converts a non-negative integer between number bases and shows the character it stands
for. The user can type in any of the editable fields, and the page updates the others.

## Conversions

- [x] User can enter the number in binary, octal, decimal or hexadecimal.
- [x] User can enter a single character, and the page shows its character code in every
      base.
- [x] The page shows the Unicode code point of the number, such as `U+00E4`, and its
      HTML numeric entity, such as `&#228;`. These fields are read-only.
- [x] Hexadecimal input accepts both upper and lower case. The output is upper case.
- [x] If the input has characters that are not valid in its base, the other fields keep
      their earlier values.

## Copying values

- [x] When the user focuses a field, its value goes to the last-value field in the top
      bar. Later edits keep updating it in that format.
- [x] The card subtitle names the format of the focused field.

## Known issues

- [ ] Binary, octal and hexadecimal output is wrong from 2^31 upward. For example,
      4294967296 gives `0` in hex. The conversion uses 32-bit bit shifts. Any integer the
      decimal field can hold exactly should convert correctly.
