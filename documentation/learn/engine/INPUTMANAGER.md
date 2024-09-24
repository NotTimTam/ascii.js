# InputManager

Handles user input.

---

## Constructor

```javascript
new InputManager(scene);
```

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
