# Scene

A scene is a level, screen, or world that can be loaded at any point during runtime.

---

## Constructor

`new Scene(runtime, config);`

### Arguments

-   `runtime` &mdash; `Runtime` The main runtime object.
-   `config` &mdash; `Object` The scene configuration object.

---

## Properties

### `layerManager`

Get the layer manager associated with this scene.

#### Returns

-   `LayerManager` The layer manager for the scene.

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
