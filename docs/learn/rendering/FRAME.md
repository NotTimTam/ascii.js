# `Frame`

A display frame.

---

## Constructor

```javascript
new Frame(data);
```

### Arguments

-   `data` &mdash; `Array<Pixel>` The frame's 1-dimensional (left-to-right, top-to-bottom) data array. Any index after `Screen Width * Screen Height` will not be displayed; no max size is enforced.

---

## Methods

### `static fromString(string)`

Convert a string to a frame.

```javascript
static fromString(string)
```

#### Arguments

-   `string` &mdash; `string` The string to convert.

#### Returns

-   `Frame` The generated Frame.

---

### `static from2DArray(array)`

Convert a 2D array of `Pixel`s to a Frame.

```javascript
static from2DArray(array)
```

#### Arguments

-   `array` &mdash; `Pixel[][]` The array to convert.
