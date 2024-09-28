# `Pixel`

Pixel data for a frame coordinate.

---

## Constructor

`new Pixel(config)`

Initializes the pixel with the specified properties.

### Arguments

-   `config` &mdash; `Object`
    -   `value` &mdash; `string` The text-value of this pixel.
    -   `color` &mdash; `string` The CSS color value of this pixel. Default: `#ffffff`.
    -   `fontWeight` &mdash; `string|number` The CSS font weight value of this pixel. Default: `normal`.
    -   `backgroundColor` &mdash; `string` An optional background color for the pixel.
    -   `solid` &mdash; `boolean` Whether or not this pixel is solid. Default: `false`. This parameter is used for collision detection.
    -   `origin` &mdash; `Array<number>` An array of display offsets to apply when rendering this pixel.

---

## Methods

### `static fromString(string)`

Create a `Pixel` object from a string.

-   `string` &mdash; `string` The string to convert to a `Pixel`.
-   **Returns**: `Pixel` the newly created `Pixel` object.

### `get width`

Get the `Pixel`'s width.

### `get height`

Get the `Pixel`'s height.
