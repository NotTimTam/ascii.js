# AdvMath

```js
import { AdvMath } from "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.esm.js";
```

## `AdvMath.aabb()`

Check if two Axis-Aligned Bounding Boxes (AABBs) overlap.

### Arguments

-   `x1` &mdash; `number` The x-coordinate of the top-left corner of box 1.
-   `y1` &mdash; `number` The y-coordinate of the top-left corner of box 1.
-   `width1` &mdash; `number` The width of box 1.
-   `height1` &mdash; `number` The height of box 1.
-   `x2` &mdash; `number` The x-coordinate of the top-left corner of box 2.
-   `y2` &mdash; `number` The y-coordinate of the top-left corner of box 2.
-   `width2` &mdash; `number` The width of box 2.
-   `height2` &mdash; `number` The height of box 2.

### Returns

Returns `boolean`. True if the AABBs overlap, false otherwise.

---

## `AdvMath.clamp()`

Clamps a number within a specified range.

### Arguments

-   `number` &mdash; `number` The number to clamp.
-   `min` &mdash; `number` The minimum value of the range.
-   `max` &mdash; `number` The maximum value of the range.

### Returns

Returns the clamped number.

---

## `AdvMath.radianToDegree()`

Converts an angle from radians to degrees.

### Arguments

-   `radian` &mdash; `number` The radian value of an angle.

### Returns

Returns the angle converted to degrees.

---

## `AdvMath.degreeToRadian()`

Converts an angle from degrees to radians.

### Arguments

-   `degree` &mdash; `number` The degree value of an angle.

### Returns

Returns the angle converted to radians.

---

## `AdvMath.range()`

Creates a random integer between two values.

### Arguments

-   `min` &mdash; `number` The minimum value.
-   `max` &mdash; `number` The maximum value.

### Returns

Returns a random integer between two values.

---

## `AdvMath.fact()`

Returns the factorial of a number.

### Arguments

-   `n` &mdash; `number` The number to return the factorial of.

### Returns

Returns the calculated factorial of `n`.

---

## `AdvMath.vectorToCartesian()`

Returns velocity per coordinate in two dimensions.

### Arguments

-   `angle` &mdash; `number` The angle (in degrees) of rotation.
-   `velocity` &mdash; `number` The velocity (in pixels) of motion at that angle.

### Returns

Returns the x and y coordinate result in an array `[x, y]`.

---

## `AdvMath.cartesianToVector()`

Convert cartesian coordinates to a vector. Based on distance from `[0, 0]`.

### Arguments

-   `x` &mdash; `number` The x-coordinate to calculate with.
-   `y` &mdash; `number` The y-coordinate to calculate with.

### Returns

Returns the vector calculation in an array `[angle, velocity]`.

---

## `AdvMath.angleBetweenPoints()`

Calculates the angle from one position to another.

### Arguments

-   `x1` &mdash; `number` The x position to send the angle from.
-   `y1` &mdash; `number` The y position to send the angle from.
-   `x2` &mdash; `number` The x position to send the angle to.
-   `y2` &mdash; `number` The y position to send the angle to.

### Returns

Returns the angle between the two points.

---

## `AdvMath.distanceBetweenPoints()`

Calculates the distance between two positions.

### Arguments

-   `x1` &mdash; `number` The x position to send the distance from.
-   `y1` &mdash; `number` The y position to send the distance from.
-   `x2` &mdash; `number` The x position to send the distance to.
-   `y2` &mdash; `number` The y position to send the distance to.

### Returns

Returns the distance between the two points.

---
