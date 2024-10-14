# `Runtime`

The overall game state and management system.

---

## Constructor

`new Runtime(config)`

Initializes the game state using the provided configuration object.

### Arguments

-   `config` &mdash; `Object` The game's config object.
    -   `renderer` &mdash; `Object` _(required)_ The renderer object used for rendering the game's visual output. This is mandatory for the runtime to function.
        -   `resolution` &mdash; `Array<number>` Determines the resolution (in characters) of the renderer. Format: `[integer width, integer height]`.
        -   `canvas` &mdash; `Element|string` A DOM `<canvas/>` element, or a CSS selector string that targets one. This element will be used for rendering.
        -   `forceParentStyles` &mdash; `Boolean` A boolean indicating whether the parent of the `config.renderer.canvas` element should have styles applied for properly containing the canvas. Ideally, the canvas' parent element is a wrapper with no other elements in it. Default `true`.
        -   `fontSize` &mdash; `string` A string CSS `font-size` value that will be used for text displayed in the renderer. Defaults to `"32px"`. An increased font size does not increase the size of characters on the screen, but their resolution quality instead. (smaller font sizes will result in blurrier characters)
        -   `scaling` &mdash; `"off"|"letterbox"` The scaling mode for the canvas. Should be one of: `"off"`, `"letterbox"`.
            -   **letterbox** &mdash; Scales the canvas element to fit the viewport without changing its aspect ratio.
            -   **off** &mdash; Does not modify the scale of the canvas element.
        -   `useWebWorkers` &mdash; `boolean` Whether or not to use web workers for rendering. Default `true`.
        -   `renderMode` &mdash; `"stacked"|"merged"` The rendering mode for the canvas. Should be one of: `"stacked"`, `"merged"`.

#### Rendering Modes Explained

##### Stacked Mode

-   **Description:** Draws each layer in order, stacked on top of each other.
-   **Behavior:** Layers are drawn one on top of the other, allowing characters to overlap.
-   **Performance:** More expensive due to multiple render calls, but offers higher quality graphics.

##### Merged Mode

-   **Description:** Compiles all layer frames into a single frame before rendering.
-   **Behavior:** Characters cannot overlap as all layers are combined into one frame.
-   **Performance:** Faster rendering compared to stacked mode due to the compilation of all frames. Additionally, identifies and skips rendering frames that are identical to the currently drawn frame, saving processing time when the screen is static. Due to the nature of this rendering mode, some graphical issues can occur, and it should only be used on lower-end devices.

---

## Attributes

### `paused`

A `boolean` that indicates whether or not this runtime is currently paused. If `true`, this `Runtime`'s `scene.layerManager.layers` do not run their object's `onTick` methods.

### `renderer`

An instance of `Renderer`.

---

## Methods

### `get webGLSupported()`

Check if the browser supports WebGL.

-   Returns `boolean`. True if WebGL is supported, false otherwise.

### `validateConfig(config)`

Validates a renderer configuration file and throws an error if it is invalid.

### `get walltime()`

Get the time since the game was initialized, in milliseconds.

-   Returns the elapsed time in milliseconds since initialization.

### `get dt()`

Get the delta time in seconds.

-   Returns the delta time divided by 1000.

### `get fps()`

Get the current frames-per-second value.

-   Returns the calculated frames per second based on the delta time.

### `loadScene(scene)`

Load a scene into the runtime. This will replace all `GameObject` and `Layer` instances.

-   `scene` &mdash; `Scene` The scene to load.
-   Throws an error if the runtime is not started or if the provided scene is not a `Scene` object.

### `start(onInitialized)`

Start the game loop.

-   `onInitialized` &mdash; _(optional)_ A method to run when the runtime has been initialized.
