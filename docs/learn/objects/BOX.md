# `Box`

A box that can be rendered on screen.

---

## Constructor

`new Box(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `config` &mdash; `Object` The `Box`'s config object.
    -   `config.x` &mdash; `number` This `Box` object's x-coordinate.
    -   `config.y` &mdash; `number` This `Box` object's y-coordinate.
    -   `config.width` &mdash; `number` This `Box` object's width.
    -   `config.height` &mdash; `number` This `Box` object's height.
    -   `config.color` &mdash; `string` Optional Box color.
    -   `config.backgroundColor` &mdash; `string` Optional background color.
    -   `config.style` &mdash; `string` The box line style. `"line" || "double"`

---

## Methods

### `get width()`

Get the rounded width of the box.

### `set width(n)`

Set the width of the box.

#### Arguments

-   `n` &mdash; `number` The new width of the box.

#### Throws

-   `Error` If the width value is not of type 'number'.

### `get height()`

Get the rounded height of the box.

### `set height(n)`

Set the height of the box.

#### Arguments

-   `n` &mdash; `number` The new height of the box.

#### Throws

-   `Error` If the height value is not of type 'number'.

### `get renderable()`

Generate the renderable representation of the box.

#### Returns

-   `PixelMesh` The PixelMesh representation of the box based on its dimensions, color, and style.

---

## Static Methods

### `asPixelMesh(width, height, color, backgroundColor, style)`

Get just the renderable `PixelMesh` portion of a `Box` instance.

#### Parameters

-   `width` &mdash; `number` This `Box` object's width.
-   `height` &mdash; `number` This `Box` object's height.
-   `color` &mdash; `string` Option Box color.
-   `backgroundColor` &mdash; `string` Optional background color.
-   `style` &mdash; `string` The box line style. `"line" || "double"`

#### Returns

The generated `PixelMesh`.

#### Example

```javascript
const myGameObject = new GameObject(scene, 0, 0, "system");

myGameObject.renderable = Box.asPixelMesh(
	width,
	height,
	color,
	backgroundColor,
	style
);
```
