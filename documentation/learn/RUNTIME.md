# `Runtime`

The overall game state and management system.

---

## Constructor

`new Runtime(config)`

Initializes the game state using the provided configuration object.

### Arguments

-   `config` &mdash; `Object` The game's config object.

    -   `seed` &mdash; `number | string` _(optional)_ A seed for random noise generation. If not provided, defaults to the current timestamp (`Date.now()`).
    -   `renderer` &mdash; `Object` _(required)_ The renderer object used for rendering the game's visual output. This is mandatory for the runtime to function.

---

## Methods

### `get renderer()`

Get the renderer in the current scene.

### `get webGLSupported()`

Check if the browser supports WebGL.

-   Returns `boolean`. True if WebGL is supported, false otherwise.

### `validateConfig(config)`

Validates a renderer configuration file and throws an error if it is invalid.

-   `config.seed` &mdash; The seed must be a `number` or `string`.
-   Throws an error if `renderer` is not provided.

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
