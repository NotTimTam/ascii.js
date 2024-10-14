# `Animate`

Animate a `GameObject`.

---

## Constructor

`new Animate(gameObject, config)`

Initializes the animation behavior for a specified game object.

### Arguments

-   `gameObject` &mdash; `GameObject` The game object to append this behavior to.
-   `config` &mdash; `Object` The configuration for this `Animate`.
    -   `enabledByDefault` &mdash; `boolean` Whether the Behavior starts out enabled. Default: `true`.
    -   `animations` &mdash; `Array<Animation>` The animations for this behavior.
    -   `initialAnimation` &mdash; `string` The label of the animation to start on.
    -   `initialFrame` &mdash; `number` The frame of the animation to start on.
    -   `overwriteObjectRenderable` &mdash; `boolean` Whether or not to force the GameObject's `renderable` property to return this `Animate` instance's `renderable` property. Default `false`.

---

## Properties

### `renderable`

Returns the current animation frame's renderable object.

**Note:** Simply adding an `Animate` behavior instance to a `GameObject` will not overwrite that object's renderable. To do this you'll need to either extend the `GameObject` class and overwrite its `renderable` getter to return the value of `Animate.renderable`, or you'll need to set `Animate.config.overwriteObjectRenderable` to `true`.

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

---

# `Animation`

An animation. The `Animate` behavior operates on the data in this object.

---

## Constructor

`new Animation(config)`

Initializes the animation with the specified configuration.

### Arguments

-   `config` &mdash; `Object` The configuration for this `Animation`.
    -   `label` &mdash; `string` This `Animation`'s label.
    -   `animationFrames` &mdash; `Array<AnimationFrame>` An array of this `Animation`'s frames.
    -   `speed` &mdash; `number` The speed at which this `Animation` should play, in frames per second.
    -   `loop` &mdash; `boolean` Whether or not this animation should loop infinitely or end after `config.repeatCount` iterations.
    -   `repeatCount` &mdash; `number` The number of times the `Animation` should repeat if `config.loop` is set to `false`.
    -   `pingPong` &mdash; `boolean` When `true`, the animation will switch directions once it reaches its end and loop back and forth from start to end.

---

## Properties

### `label`

The label of the animation.

### `animationFrames`

An array of frames for the animation.

### `speed`

The speed of the animation in frames per second.

### `loop`

Whether the animation loops infinitely.

### `repeatCount`

The number of times the animation should repeat.

### `pingPong`

Whether the animation plays in both directions.

---

# `AnimationFrame`

An animation frame. The `renderable` value of this Frame should return a `Pixel` or `PixelMesh` that will determine what is displayed on this frame.

---

## Constructor

`new AnimationFrame(renderable, duration)`

Initializes the animation frame with the specified renderable item and duration.

### Arguments

-   `renderable` &mdash; `Pixel|PixelMesh` The renderable item to display for this frame.
-   `duration` &mdash; `number` The duration (in frames) of this frame. Example: a value of `2` will make this frame last twice as long as the rest.

---

## Properties

### `duration`

The duration of the animation frame.

### `renderable`

The renderable item for the animation frame.
