# InputManager

Handles user input.

---

## Constructor

`new InputManager(scene);`

### Arguments

-   `scene` &mdash; `Scene` The current scene.

---

## Properties

### `hasPointerLock`

Get the pointer lock status.

### `types`

An array of valid event listener types.

---

## Methods

### `requestPointerLock()`

Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.

### `addEventListener(type, listener)`

Add an event listener to the input manager.

-   `type` &mdash; `string` The type of event to add.
-   `listener` &mdash; `function` The event listener function.

### `removeEventListener(type, listener)`

Remove an event listener from the input manager.

-   `type` &mdash; `string` The type of event to remove.
-   `listener` &mdash; `function` The event listener function that was added to the event listener.

### `watchObjectClick(gameObjectId, listener)`

Add a listener for clicks on a `GameObject`.

-   `gameObjectId` &mdash; `string` The ID of the `GameObject` that, when clicked, triggers the event.

### `unwatchObjectClick(gameObjectId, listener)`

Remove a listener for clicks on a `GameObject`.

-   `gameObjectId` &mdash; `string` The ID of the `GameObject`.
-   `listener` &mdash; `function` The event listener function that was added to the event listener.
