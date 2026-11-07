# Common behaviour

Behaviour that is shared by all cards.

## Last value

The top bar has a last-value field. It holds the value the user is working on, so they
can copy it without selecting the text in a card.

- [x] User can copy the last value to the clipboard with one click, or edit it by hand.
- [x] When the user focuses a field that can be copied, its value goes to the last-value
      field, and the field becomes the selected field of its card.
- [x] The last-value field follows the selected field. When the user edits any field on
      the same card, the last-value field shows the new value of the selected field, in
      the format of the selected field.
- [x] When the user generates a value, it goes to the last-value field.
- [x] The card subtitle names the selected field.
