# Layer

A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.

---

## Constructor

```javascript
new Layer(layerManager, config);
```

### Arguments

-   `layerManager` &mdash; `LayerManager` The `LayerManager` parent object.
-   `config` &mdash; `Object` The `Layer`'s config object.
    -   `config.label` &mdash; `string` This layer's label.
    -   `config.parallax` &mdash; `Array<Number>` This layer's parallax array. `[x, y]` Numbers 0-1 determine how much this layer moves with the camera. `[0, 0]` for layers that do not move.
    -   `config.gameObjectConstructors` &mdash; `Array<function>` An array of functions that return game objects.

---

## Attributes

### `paused`

A `boolean` that indicates whether or not this layer is currently paused. A paused frame, or a frame in a paused runtime does not run its object's `onTick` methods.

### `frame`

Returns a frame composed of a layer's objects.

---

## Methods

### `get visible`

Get the `Layer`'s visibility status.

### `set visible(value)`

Set the `Layer`'s visibility status.
