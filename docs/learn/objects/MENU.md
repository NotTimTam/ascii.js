# Menu

A menu that can be rendered on screen with selectable options.

---

## Constructor

`new Menu(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `config` &mdash; `Object` The `Menu`'s config object.
    -   `config.x` &mdash; `number` This `Box` object's x-coordinate.
    -   `config.y` &mdash; `number` This `Box` object's y-coordinate.
    -   `config.options` &mdash; `Object` An object of key-value pairs, where the values represent option labels, and the keys are returned when an option is selected.
    -   `config.callback` &mdash; `function` A callback function called when a menu option is selected, passed the key of the selected option.
    -   `config.title` &mdash; `string` Optional menu title.

---

## Methods

### `handleInput(event)`

Handle input events to navigate and select options in the menu.

#### Arguments

-   `event` &mdash; `Object` The input event to handle.

---

### `get width()`

Get the width of the menu.

#### Returns

-   `number` The width of the menu based on the longest option and title.

---

### `get height()`

Get the height of the menu.

#### Returns

-   `number` The height of the menu based on the number of options.

---

### `determineLongestOption()`

Determine the length of the longest option label.

#### Returns

-   `number` The length of the longest option label.

---

### `get renderable()`

Generate the renderable representation of the menu.

#### Returns

-   `PixelMesh` The PixelMesh representation of the menu including options and title.
