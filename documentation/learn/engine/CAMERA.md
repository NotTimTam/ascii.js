# Camera

The scene contains variable layers and compiles them into one frame to render to the screen.

---

## Constructor

```javascript
new Camera(renderer);
```

### Arguments

-   `renderer` &mdash; `Renderer` The `Renderer` this `Camera` is a part of.

---

## Properties

### `renderable`

Returns undefined.

---

## Methods

### `isOnScreen(x, y, width, height, parallaxX, parallaxY)`

Check if a bounding box is on screen.

#### Arguments

-   `x` &mdash; `number` The x-coordinate to check.
-   `y` &mdash; `number` The y-coordinate to check.
-   `width` &mdash; `number` The width to check.
-   `height` &mdash; `number` The height to check.
-   `parallaxX` &mdash; `number` Optional parallax x-value. (0-1)
-   `parallaxY` &mdash; `number` Optional parallax y-value. (0-1)
