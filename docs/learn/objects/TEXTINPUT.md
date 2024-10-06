# TextInput

A text input that can be rendered on screen.

---

## Constructor

`new TextInput(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `config` &mdash; `Object` The `TextInput`'s config object.
    -   `config.x` &mdash; `number` This `TextInput` object's x-coordinate.
    -   `config.y` &mdash; `number` This `TextInput` object's y-coordinate.
    -   `config.maxWidth` &mdash; `number` The maximum width of the `TextInput`.
    -   `config.value` &mdash; `string` The text to display. (use `"\n"` for newlines)
    -   `config.color` &mdash; `string` Optional text color.
    -   `config.activeColor` &mdash; `string` Optional text color for active character.
    -   `config.backgroundColor` &mdash; `string` Optional background color.
    -   `config.backgroundColorActive` &mdash; `string` Optional background color for active key.
    -   `config.fontWeight` &mdash; `string` Optional font weight.
    -   `config.autoFocus` &mdash; `boolean` Automatically focus on element once it is instantiated.
    -   `config.onChange` &mdash; `function` Callback that runs when the input's value changes.
    -   `config.onKeyDown` &mdash; `function` Callback that runs when the input receives a keypress.
    -   `config.maxLength` &mdash; `number` An optional maximum input length.

---

## Properties

### `caret`

The current position of the caret.

### `renderable`

The renderable `PixelMesh` representation of the `TextInput`, including text color, background color, and caret behavior.
