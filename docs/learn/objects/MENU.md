# Menu

A menu of various items that can be rendered on screen.

---

## Constructor

`new Menu(scene, config);`

### Arguments

-   `scene` &mdash; `Scene` The scene this `Menu` is a part of.
-   `config` &mdash; `Object` The `Menu`'s config object.
    -   `x` &mdash; `number` This `Menu` object's x-coordinate.
    -   `y` &mdash; `number` This `Menu` object's y-coordinate.
    -   `items` &mdash; `Array<Menu.Item>` An array of `Menu.Item` instances. You can extend the `Menu.Item` class to make your own items.
    -   `title` &mdash; `string` Optional menu title.
    -   `alignCenter` &mdash; `boolean` Whether or not to align the content to the center of the menu. Default `true`.
    -   `border` &mdash; `boolean` Whether or not to create a border around the menu. Default `true`.
    -   `layer` &mdash; `string` The label of the layer to start the `Menu` on.
    -   `autoFocus` &mdash; `boolean` Whether to automatically focus on the `Menu` after it has been instantiated. Default `true`.
    -   `maintainFocus` &mdash; `boolean` Forces the menu to stay focused. Default `true`.
    -   `deleteOnBlur` &mdash; `boolean` Whether to delete the menu when it becomes unfocused. Default `false`.
    -   `gamepad` &mdash; `number` An optional number indicating the gamepad (0-based index) this menu should accept input from. Set to `-1` to accept input from all gamepads.

---

## Properties

### `gamepad`

The current gamepad index.

### `items`

An array of `Menu.Item` instances that are part of the menu.

### `title`

The title of the menu.

### `index`

The index of the current item that is selected in the menu.

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

---

### `blur()`

Unfocus the menu. If `maintainFocus` is true, the menu will not be unfocused.

---

### `itemAtCoordinate(y)`

Get an item at a y-coordinate relative to the menu.

#### Arguments

-   `y` &mdash; `number` The y-coordinate to check.

#### Returns

-   `Menu.Item|undefined` The item at that coordinate, or `undefined` if there is no item at the coordinate.

---

## Sub-Classes

### `Menu.Item`

Base class for menu items, which can be extended to create custom items.

### `Menu.Button`

A string of text that triggers an event when clicked.

#### Constructor

`new Menu.Button(config);`

##### Arguments

-   `config` &mdash; `Object` The `Button`'s config object.
    -   `label` &mdash; `string` The `Button`'s display label.
    -   `callback` &mdash; `function` The function to call when this item is clicked/activated.
    -   `wrap` &mdash; `boolean` Whether or not to wrap the text if it overflows the container. Will break words. Default `false`.

### `Menu.Slider`

A slider that allows value selection.

#### Constructor

`new Menu.Slider(config);`

##### Arguments

-   `config` &mdash; `Object` The `Slider`'s config object.
    -   `label` &mdash; `string` An optional `Slider` display label.
    -   `value` &mdash; `number` The starting value of the `Slider`.
    -   `min` &mdash; `number` The minimum value for the `Slider`.
    -   `max` &mdash; `number` The maximum value for the `Slider`.
    -   `step` &mdash; `number` The amount the value will change by each input.
    -   `onChange` &mdash; `function` The function to call when the value of this `Slider` changes.
    -   `callback` &mdash; `function` The function to call when "enter" is pressed on the `Slider`. This callback is passed the current `Menu.Slider` value as an argument.
    -   `showValue` &mdash; `boolean` Whether to show the value of the `Slider` after it. Default: `false`.
    -   `showPercentage` &mdash; `boolean` Whether to show the value (in percentage format) of the `Slider` after it. Default: `true`.

### `Menu.Toggle`

A checkbox that can be toggled on or off.

#### Constructor

`new Menu.Toggle(config);`

##### Arguments

-   `config` &mdash; `Object` The `Toggle`'s config object.
    -   `label` &mdash; `string` The `Toggle`'s display label.
    -   `checked` &mdash; `boolean` The initial status of the `Toggle`. Default: `false`.
    -   `prepend` &mdash; `boolean` Whether to put the checkbox icon at the start or end of the label. Default: `true`.
    -   `callback` &mdash; `function` The function to call when this item is toggled.
