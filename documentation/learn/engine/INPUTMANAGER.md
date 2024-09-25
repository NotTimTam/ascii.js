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

---

## Methods

### `requestPointerLock()`

Initiate a pointer lock request. Pointer lock cannot be achieved unless the user clicks the screen after this method is called.

### `addEventListener(listener)`

Add an event listener to the input manager.

#### Arguments

-   `listener` &mdash; `function` The event listener function.

### `removeEventListener(listener)`

Remove an event listener from the input manager.

#### Arguments

-   `listener` &mdash; `function` The event listener function.

### `addOnClick(gameObject, listener)`

Add an event listener to check when an element is clicked.

#### Arguments

-   `gameObject` &mdash; `GameObject` The game object that, when clicked, triggers the event.
-   `listener` &mdash; `function` The event listener function.

### `removeOnClick(gameObject, listener)`

Remove a click event listener.

#### Arguments

-   `gameObject` &mdash; `GameObject` The game object that the event was created for.
-   `listener` &mdash; `function` The event listener function.
