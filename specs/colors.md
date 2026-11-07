# Colors

Converts a color between hex, RGB and HSL. The user can enter the color in any of the
three, and the page updates the others. The page opens with white.

## Entering a color

- [x] User can set each RGB channel by typing it in hex, typing it in decimal, or
      dragging a slider. The page also shows the channel as a number between 0 and 1.
- [x] User can type the color as a hex code, in the long form such as `#ff8800` or the
      short form such as `#f80`.
- [x] User can set the hue, saturation and lightness with sliders.
- [x] Each slider shows a color bar of what the color looks like along that slider. The
      saturation and lightness bars follow the current hue.
- [x] The card header shows a swatch of the current color.
- [x] The page shows the color as an RGB string with channels between 0 and 1, such as
      `rgb(1.000, 0.533, 0.000)`. This field is read-only.

## Stored colors

- [x] User can store the current color under a name.
- [x] User can pick a stored color, which sets it as the current color.
- [x] User can remove a stored color.
- [x] The stored colors are kept in the browser and restored when the user comes back.

## Copying values

- [x] When the user focuses the hex field or the RGB string, its value goes to the
      last-value field in the top bar. Later changes to the color keep updating it in
      that format.
- [x] The card subtitle names the format of the focused field.

## Open questions

- `colors.ts` uses two scales for the color channels. It divides by 255 when it turns a
  channel into a number between 0 and 1, but multiplies by 256 when it turns the number
  back into a channel. A round trip from RGB to HSL and back gives the same RGB value, so
  this may be deliberate. Decide which scale is correct and state it in the spec.
- `HSLMaxValue` is 719, so the HSL sliders go from 0 to 719 for hue, saturation and
  lightness alike. Is this part of the color model, or only the resolution of the
  sliders?
