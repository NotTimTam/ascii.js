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
