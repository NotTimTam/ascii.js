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
