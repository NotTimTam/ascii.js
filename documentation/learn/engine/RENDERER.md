# Renderer

Handles rendering the game using **2D Context**.

## Constructor

### `constructor(runtime)`

Creates an instance of the `Renderer`.

#### Arguments

-   `runtime` &mdash; `Runtime` The current `Runtime` instance.

---

## Properties

### `width`

#### Returns

The display's character width.

### `height`

#### Returns

The display's character height.

---

## Methods

### `static validateConfig(config)`

Validates a renderer configuration file and throws an error if it is invalid.

#### Arguments

-   `config` &mdash; `Object` The config object to validate.

### `clearDisplay()`

Clears the screen.

### `drawFrame(frame)`

Draws a frame to the screen.

#### Arguments

-   `frame` &mdash; `Frame` The frame to draw.

### `coordinatesToIndex(x, y)`

Determines the frame index of a pixel coordinate.

#### Arguments

-   `x` &mdash; `number` The x-value of the coordinate.
-   `y` &mdash; `number` The y-value of the coordinate.

#### Returns

The index of that coordinate in a frame.

### `indexToCoordinates(index)`

Converts a frame index into x and y coordinates.

#### Arguments

-   `index` &mdash; `number` The frame index.

#### Returns

A coordinate array.

### `compileFrames(...frames)`

Compiles several frames. The last frame provided is on top.

#### Arguments

-   `...frames` &mdash; `Frame` The frames to compile.

#### Returns

The compiled frames.
