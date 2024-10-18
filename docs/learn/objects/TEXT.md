# `Text`

A string of text that can be rendered on screen.

---

## Constructor

`new Text(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `config` &mdash; `Object` The `Text`'s config object.
    -   `config.x` &mdash; `number` This `Text` object's x-coordinate.
    -   `config.y` &mdash; `number` This `Text` object's y-coordinate.
    -   `config.maxWidth` &mdash; `number` The maximum width of the `Text`. Defaults to `Renderer.width`.
    -   `config.value` &mdash; `string` The text to display. (use `"\n"` for newlines)
    -   `config.wrap` &mdash; `boolean` Whether to wrap the text if it overflows the screen.
    -   `config.color` &mdash; `string` Optional text color.
    -   `config.backgroundColor` &mdash; `string` Optional background color.
    -   `config.fontWeight` &mdash; `string` Optional font weight.

---

## Properties

### `value`

The `string` value of the text object.

### `renderable`

Get the `PixelMesh` renderable representation of the text.
