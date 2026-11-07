# Colors

Converts a color between hex, RGB and HSL. The user can enter the color in any of the
three, and the page updates the others.

The requirements of this area are not written yet. Until they are, this file lists the
questions that are already known.

## Open questions

- `colors.ts` uses two scales for the color channels. It divides by 255 when it turns a
  channel into a number between 0 and 1, but multiplies by 256 when it turns the number
  back into a channel. A round trip from RGB to HSL and back gives the same RGB value, so
  this may be deliberate. Decide which scale is correct and state it in the spec.
- `HSLMaxValue` is 719, so the HSL sliders go from 0 to 719 for hue, saturation and
  lightness alike. Is this part of the color model, or only the resolution of the
  sliders?
