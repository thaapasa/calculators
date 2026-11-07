# Identifiers

Checks and generates Finnish identifiers: the personal identity code (hetu), the bank
reference number, the company ID (Y-tunnus), and Luhn check digits. The page can also
generate random strings and UUIDs, and check a UUID.

## Check characters

- [x] User can type a hetu without its check character, and the page shows the check
      character. The century separators `-`, `+` and `A` are accepted.
- [x] User can type a bank reference without its check digit, and the page shows the
      check digit.
- [x] User can type a company ID without its check digit, and the page shows the check
      digit. The full ID has a dash before the check digit, such as `1234567-1`.
- [x] User can type any number, and the page shows its Luhn check digit.
- [x] If the input cannot get a check character, such as a hetu of the wrong length, the
      page shows no check character. If the company ID or Luhn input has no valid check
      digit, the page shows `-`.

## Generating values

- [x] User can generate a random hetu, bank reference or company ID. The page fills in
      the input and shows its check character.
- [x] User can generate a random string of 64 characters. The string leaves out
      characters that are easy to mix up, such as `l`, `O` and `0`.
- [x] User can generate a UUID of version 1, 4 or 7.

## Checking a UUID

- [x] User can paste a UUID, and the page tells whether it is valid and which version it
      is.
- [x] For a version 7 UUID, the page shows the time stored in it, both in milliseconds
      since the epoch and as a date and time.
- [x] A generated UUID goes to the check field.

## Copying values

- [x] When the user focuses a field or generates a value, the full value with its check
      character goes to the last-value field in the top bar.
- [x] The card subtitle names the identifier of the focused field.

## Known issues

- [ ] A generated hetu never falls on the 29th, 30th or 31st of a month. `generate()` in
      `hetu.ts` picks the day from 1 to 28, and a TODO there says so. A generated hetu
      should be able to have any real calendar date.
- [ ] The hetu check does not check that the date part is a real date. For example,
      `319999-123` gets a check character. An invalid date should make the hetu invalid.

## Open questions

- `generate()` in `hetu.ts` and in `bankreference.ts` returns a value without its check
  character, and the page adds the check character separately. Is this the intent? The
  code does not say, and the spec should state it either way.
