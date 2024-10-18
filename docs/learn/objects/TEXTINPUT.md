# `TextInput`

A text input that can be rendered on screen.

---

## Constructor

`new TextInput(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `config` &mdash; `Object` The `TextInput`'s config object.
    -   `x` &mdash; `number` This `TextInput` object's x-coordinate.
    -   `y` &mdash; `number` This `TextInput` object's y-coordinate.
    -   `maxWidth` &mdash; `number` The maximum width of the `TextInput`.
    -   `value` &mdash; `string` The text to display. (use `"\n"` for newlines)
    -   `color` &mdash; `string` Optional text color.
    -   `activeColor` &mdash; `string` Optional text color for active character.
    -   `backgroundColor` &mdash; `string` Optional background color.
    -   `backgroundColorActive` &mdash; `string` Optional background color for active key.
    -   `fontWeight` &mdash; `string` Optional font weight.
    -   `autoFocus` &mdash; `boolean` Automatically focus on element once it is instantiated.
    -   `onChange` &mdash; `function` Callback that runs when the input's value changes.
    -   `onKeyDown` &mdash; `function` Callback that runs when the input receives a keypress.
    -   `onFocus` &mdash; `function` Callback that runs when focus on this input is gained.
    -   `onBlur` &mdash; `function` Callback that runs when focus on this input is lost.
    -   `maxLength` &mdash; `number` An optional maximum input length.

---

## Properties

### `caret`

The current position of the caret.

### `renderable`

The renderable `PixelMesh` representation of the `TextInput`, including text color, background color, and caret behavior.
