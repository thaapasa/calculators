# Identifiers

Checks and generates Finnish identifiers: the personal identity code (hetu), the bank
reference number, the company ID (Y-tunnus), and Luhn check digits. The page can also
generate random strings and UUIDs, and check a UUID.

## Check characters

- [x] User can type a hetu without its check character, and the page shows the check
      character. All the century separators are accepted, also the ones added in 2023:
      `+` for the 1800s, `-`, `Y`, `X`, `W`, `V` and `U` for the 1900s, and `A`, `B`, `C`,
      `D`, `E` and `F` for the 2000s.
- [x] If the date of a hetu does not exist, such as 31 April, the hetu is invalid. The
      century of the separator decides leap years.
- [x] User can type a bank reference without its check digit, and the page shows the
      check digit.
- [x] User can type a company ID without its check digit, and the page shows the check
      digit. The full ID has a dash before the check digit, such as `1234567-1`.
- [x] User can type any number, and the page shows its Luhn check digit.
- [x] If the input cannot get a check character, such as a hetu of the wrong length, the
      page shows no check character. If the company ID or Luhn input has no valid check
      digit, the page shows `-`.

## Generating values

- [x] User can generate a random hetu, bank reference or company ID. The generated value
      is what the user would type, so it has no check character. The page fills it in
      and shows the check character, as if the user had typed it.
- [x] A generated hetu can have any real date in its range of years, and an individual
      number that is given to people, not a temporary one.
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

- [x] Every identifier and UUID can be copied through the
      [last value](common.md#last-value). The copied value includes the check character.
