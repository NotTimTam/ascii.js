# `Animate`

Animate a `GameObject`.

---

## Constructor

`new Animate(scene, gameObject, enabledByDefault = true, config)`

Initializes the animation behavior for a specified game object.

### Arguments

-   `scene` &mdash; `Scene` The scene this object is a part of.
-   `gameObject` &mdash; `GameObject` The game object to append this behavior to.
-   `enabledByDefault` &mdash; `boolean` Whether the Behavior starts out enabled. Default: `true`.
-   `config` &mdash; `Object` The configuration for this `Animate`.
    -   `animations` &mdash; `Array<Animation>` The animations for this behavior.
    -   `initialAnimation` &mdash; `string` The label of the animation to start on.
    -   `initialFrame` &mdash; `number` The frame of the animation to start on.

---

## Properties

### `renderable`

Returns the current animation frame's renderable object.

### `currentAnimationFrameIndex`

The current animation frame index.

### `currentAnimationFrame`

The current animation frame object.

### `animationFrameCount`

The number of frames in the current animation.

### `currentAnimation`

The current `Animation` object based on the label.

---

## Methods

### `set currentAnimation(label)`

Sets the current animation by label.

### `static validateConfig(config)`

Validates the configuration object for the `Animate` behavior.
