# Identifiers

Checks and generates Finnish identifiers: the personal identity code (hetu), the bank
reference number, the company ID (Y-tunnus), and Luhn check digits. The page can also
generate a random string.

The requirements of this area are not written yet. Until they are, this file lists the
problems that are already known.

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
