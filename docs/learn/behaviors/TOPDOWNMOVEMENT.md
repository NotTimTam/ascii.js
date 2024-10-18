# `TopDownMovement`

Move a `GameObject` from a top-down perspective.

---

## Constructor

`new TopDownMovement(gameObject, enabledByDefault = true, config)`

Initializes the movement behavior for a specified game object.

### Arguments

-   `gameObject` &mdash; `GameObject` The game object to append this behavior to.
-   `enabledByDefault` &mdash; `boolean` Whether the Behavior starts out enabled. Default: `true`.
-   `config` &mdash; `Object` The configuration for this `TopDownMovement`.
    -   `defaultControls` &mdash; `boolean` Whether to automatically handle input using the arrow keys. Default: true.

---

## Methods

### `static validateConfig(config)`

Validates a TopDownMovement configuration object and throws an error if it is invalid.

### `handleInput(event)`

Handles input events to move the GameObject based on user controls.

### `simulateControlUp()`

Attempt to move `GameObject` up.

### `simulateControlDown()`

Attempt to move `GameObject` down.

### `simulateControlLeft()`

Attempt to move `GameObject` left.

### `simulateControlRight()`

Attempt to move `GameObject` right.
