# `PixelMesh`

A pixel mesh stores a 2-dimensional array of `Pixels`.

---

## Constructor

`new PixelMesh(config)`

Initializes the pixel mesh with the specified data and origin.

### Arguments

-   `config` &mdash; `Object`
    -   `data` &mdash; `Array<Pixel>` The frame's 2-dimensional (array of row arrays of `Pixels`) (left-to-right, top-to-bottom) data array.
    -   `origin` &mdash; `Array<number>` An array of display offsets to apply when rendering this pixel.

---

## Methods

### `get width`

Get the `PixelMesh`'s width.

### `get height`

Get the `PixelMesh`'s height.
