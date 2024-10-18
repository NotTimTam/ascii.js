# `Camera`

The scene contains variable layers and compiles them into one frame to render to the screen.

---

## Constructor

```javascript
new Camera(scene);
```

### Arguments

-   `scene` &mdash; `Scene` The `Scene` this `Camera` is a part of.

---

## Methods

### `isOnScreen(x, y, width, height, parallaxX, parallaxY)`

Check if a bounding box is on screen.

#### Arguments

-   `x` &mdash; `number` The x-coordinate to check.
-   `y` &mdash; `number` The y-coordinate to check.
-   `width` &mdash; `number` The width to check.
-   `height` &mdash; `number` The height to check.
-   `parallaxX` &mdash; `number` Optional parallax x-value.
-   `parallaxY` &mdash; `number` Optional parallax y-value.
