# `LayerManager`

The layer manager contains variable layers and compiles them into one frame to render to the screen.

---

## Constructor

```javascript
new LayerManager(scene, layers);
```

### Arguments

-   `scene` &mdash; `Scene` The scene this layerManager is for.
-   `layers` &mdash; `Object[]` The layer configuration objects.

---

## Attributes

### `get visibleLayers`

Get all `Layer`s associated with this `LayerManager` instance, whose `visible` attribute is set to `true`.

---

## Methods

### `getLayerByLabel(label)`

Get a layer by its label.

#### Arguments

-   `label` &mdash; `string` The label of the layer to get.

#### Returns

-   `Layer` A layer with the label provided. Or `undefined` if no layer was found.

### `getAtPosition(x, y, layer)`

Check for content at a location.

#### Arguments

-   `x` &mdash; `number` The x-coordinate to check.
-   `y` &mdash; `number` The y-coordinate to check.
-   `layer` &mdash; `string` An optional layer to check. If no layer is provided, all layers are checked.

### `solidAtPosition(x, y, layer)`

Check for a solid at a location.

#### Arguments

-   `x` &mdash; `number` The x-coordinate to check.
-   `y` &mdash; `number` The y-coordinate to check.
-   `layer` &mdash; `string` An optional layer to check. If no layer is provided, all layers are checked.
