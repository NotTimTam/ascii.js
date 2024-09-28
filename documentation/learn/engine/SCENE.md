# Scene

A scene is a level, screen, or world that can be loaded at any point during runtime.

---

## Constructor

`new Scene(runtime, config);`

### Arguments

-   `runtime` &mdash; `Runtime` The main runtime object.
-   `config` &mdash; `Object` The scene configuration object.
    -   `config.label` &mdash; `string` The `Scene`'s label.
    -   `config.layers` &mdash; `Array<Object>` The configuration objects for each layer in the `Scene`.
    -   `config.layers[].label` &mdash; `string` The layer's label.
    -   `config.layers[].parallax` &mdash; `Array<number>` Optional parallax data, where the format is [integer, integer]. (`[1, 1]` is 100% parallax, `[0, 0]` is 0% parallax)
    -   `config.layers[].gameObjectConstructors` &mdash; `Array<function>` Optional callback functions that return `GameObject`s for this layer.
    -   `config.layers[].gameObjectConstructors[]` &mdash; `function` A callback function, passed this `Scene` as an argument, that return an instance of `GameObject`. This `GameObject` is automatically added to the constructed `Layer`.
    -   `config.onLoad` &mdash; `function` A callback (passed this `Scene` as an argument) that runs when the `Scene` has finished loading.
    -   `config.onTick` &mdash; `function` A callback (passed this `Scene` as an argument) that runs every frame that this `Scene` is loaded.

---

## Properties

### `layerManager`

This scene's `LayerManager` instance.

### `camera`

This scene's `Camera` instance.

---

### `camera`

Get the camera associated with this scene.

#### Returns

-   `Camera` The camera object for the scene.

---

## Methods

### `static validateConfig(config)`

Validates a scene configuration file and throws an error if it is invalid.

#### Arguments

-   `config` &mdash; `Object` The config object to validate.
