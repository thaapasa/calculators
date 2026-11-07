# Pixel density

Converts an image size between the screen densities of Android and iOS. A designer can
enter the size of an asset at one density and read the pixel sizes for the others.

## Densities

- [x] The page lists the Android densities mdpi (1×), hdpi (1.5×), xhdpi (2×), xxhdpi (3×)
      and xxxhdpi (4×), and the iOS densities @1x, @2x and @3x.
- [x] Each density has a width and a height in pixels. Width and height convert
      separately, and the user can fill in only one of them.
- [x] When the user types a size at one density, the page fills in that size at every
      other density.
- [x] Whole numbers are shown as such. Other values are shown to three decimals.
- [x] If the input is not a number, or is negative, the other fields keep their earlier
      values.

## Copying values

- [x] When the user focuses a field, its value goes to the last-value field in the top
      bar.
- [x] The card subtitle names the density of the focused field.

## Open questions

- On the other cards, the last-value field follows later edits of the focused field. Here
  it only gets the value at the moment of focus. Should it follow edits too?
