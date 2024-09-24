# Renderer

Handles rendering the game using **2D Context**.

## Constructor

### `constructor(scene, layers)`

Creates an instance of the `Renderer`.

-   **Parameters**
    -   `scene` {Scene} - The scene this Object is a part of.
    -   `layers` {Array<Object>} - The layer configuration objects to pass to this `Renderer` instance's `LayerManager` instance.

## Properties

### `width`

-   **Returns**: The display's character width.

### `height`

-   **Returns**: The display's character height.

## Methods

### `static validateConfig(config)`

Validates a renderer configuration file and throws an error if it is invalid.

-   **Parameters**
    -   `config` {Object} - The config object to validate.

### `clearDisplay()`

Clears the screen.

### `drawFrame(frame)`

Draws a frame to the screen.

-   **Parameters**
    -   `frame` {Frame} - The frame to draw.

### `coordinatesToIndex(x, y)`

Determines the frame index of a pixel coordinate.

-   **Parameters**
    -   `x` {number} - The x-value of the coordinate.
    -   `y` {number} - The y-value of the coordinate.
-   **Returns**: {number} - The index of that coordinate in a frame.

### `indexToCoordinates(index)`

Converts a frame index into x and y coordinates.

-   **Parameters**
    -   `index` {number} - The frame index.
-   **Returns**: {Array<Number>} - A coordinate array.

### `compileFrames(...frames)`

Compiles several frames. The last frame provided is on top.

-   **Parameters**
    -   `...frames` {Frame} - The frames to compile.
-   **Returns**: {Frame} - The compiled frames.
