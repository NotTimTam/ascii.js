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

## Properties

### `origin`

An array of display offsets to apply when rendering this pixel.

### `pixels`

Get all the `Pixel`s in this `PixelMesh` in a 1D-array.

### `width`

The `PixelMesh`'s width.

### `height`

The `PixelMesh`'s height.

---

## Methods

### `setColor(color)`

Set the color of all `Pixels` in this `PixelMesh`.

#### Arguments

-   `color` &mdash; `string` The color to set.

### `setFontWeight(fontWeight)`

Set the fontWeight of all `Pixels` in this `PixelMesh`.

#### Arguments

-   `fontWeight` &mdash; `string` The fontWeight to set.

### `setBackgroundColor(backgroundColor)`

Set the backgroundColor of all `Pixels` in this `PixelMesh`.

#### Arguments

-   `backgroundColor` &mdash; `string` The backgroundColor to set.

### `setSolid(solid)`

Set the solid status of all `Pixels` in this `PixelMesh`.

#### Arguments

-   `solid` &mdash; `string` Whether or not the pixels should be solid.

---

## Static Methods

### `fromString(string)`

Create a `PixelMesh` object from a string. `\n` will create a new row.

Example:

```javascript
PixelMesh.fromString("This is my string.\nThis is the next line.");
```

#### Arguments

-   `string` &mdash; `string` The string to convert to a `PixelMesh`.

#### Returns

The newly created `PixelMesh` object.
