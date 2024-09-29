# `Behavior`

A core object that modifies the behavior of a GameObject. Behaviors need an `onTick` method that will run every frame right before their `GameObject`'s `onTick`.

---

## Constructor

`new Behavior(scene, gameObject, enabledByDefault = true)`

Initializes the behavior object, associating it with a specific scene and game object.

### Arguments

-   `scene` &mdash; `Scene` The scene this object is a part of.
-   `gameObject` &mdash; `GameObject` The game object to append this behavior to.
-   `enabledByDefault` &mdash; `boolean` Whether the behavior starts out enabled. Default: `true`.

---

## Methods

### `onTick()`

If this `Behavior` has an `onTick` method, and is part of a `GameObject` that is on a `Layer`. Every animation frame the `onTick` method will be executed.
