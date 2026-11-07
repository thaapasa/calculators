# Byte sizes

Converts a data size between bytes, binary units and decimal units. The user can type in
any field, and the page updates the others.

## Units

- [x] User can enter the size in bytes.
- [x] User can enter the size in binary units: KiB, MiB, GiB and TiB, each 1024 times the
      one before.
- [x] User can enter the size in decimal units: kB, MB, GB and TB, each 1000 times the
      one before. The Finnish UI labels them Kt, Mt, Gt and Tt.
- [x] Bytes are shown as a whole number. The other units are shown to three decimals.
- [x] If the input is not a number, the other fields keep their earlier values.

## Copying values

- [x] When the user focuses a field, its value goes to the last-value field in the top
      bar. Later edits keep updating it in that unit.
- [x] The card subtitle names the unit of the focused field.

## Open questions

- The decimal units show `Kt`, `Mt`, `Gt` and `Tt` also in the English UI. Should the
  English UI show `kB`, `MB`, `GB` and `TB`?
