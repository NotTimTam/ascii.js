# `GameObject`

A core object that can have its runtime methods managed by the runtime itself, or another object.

`GameObject`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes. `GameObject`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `GameObject`'s logic will function. `GameObject`s will not be rendered unless they are added to a layer.

---

## Constructor

`new GameObject(scene, x = 0, y = 0)`

Initializes the game object, associating it with a specific scene and setting its coordinates.

### Arguments

-   `scene` &mdash; `Scene` The scene this object is a part of.
-   `x` &mdash; `number` This entity's x-coordinate. Default: `0`.
-   `y` &mdash; `number` This entity's y-coordinate. Default: `0`.

---

## Methods

### `get isOnScreen`

Get whether the game object is on-screen.

### `get visible`

Get the `GameObject`'s visibility status.

### `set visible(value)`

Set the `GameObject`'s visibility status.

### `get x`

Get the game object's adjusted x-coordinate.

### `set x(n)`

Set the game object's x-coordinate.

### `get y`

Get the game object's adjusted y-coordinate.

### `set y(n)`

Set the game object's y-coordinate.

### `get width`

Get the width of this `GameObject`'s renderable.

### `get height`

Get the height of this `GameObject`'s renderable.

### `get origin`

Get the origin of this `GameObject`'s renderable.

### `get layer`

Get the `GameObject`'s current layer.

### `get layerLabel`

Get the label of the `GameObject`'s current layer.

### `set layer(label)`

Change the `GameObject`'s layer. Set to a falsey value to remove from any active layers.

### `get renderable`

The object's renderable element. `GameObject`s and all classes that extend them have a `renderable` property that the `Renderer` grabs for rendering them to the screen. When extending the `GameObject` class, you can overwrite this getter with one that returns a `Pixel` or `PixelMesh` instance for custom rendering.

You can also overwrite the getter by setting the `renderable` property of a `GameObject` instance after it has been instantiated.

Example:

```js
const instance = new GameObject(myLevel, 0, 0);

instance.renderable = new Pixel({
	value: "E",
	color: "white",
	fontWeight: 800,
	backgroundColor: "red",
	solid: false,
	origin: [-1, 3],
});
```

### `get paused`

Whether the object is on a paused layer or the runtime is paused.

### `filterThis(array)`

Filter this `GameObject` out of an array.
