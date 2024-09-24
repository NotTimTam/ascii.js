# Entity

An `Entity` is generally a non-static `GameObject`, interactable in some way.

---

## Constructor

`new Entity(scene, x, y);`

### Arguments

-   `scene` &mdash; `Scene` The scene this Object is a part of.
-   `x` &mdash; `number` This `Entity`'s x-coordinate.
-   `y` &mdash; `number` This `Entity`'s y-coordinate.

---

## Methods

### `get renderable()`

Generate the renderable representation of the entity.

#### Returns

-   `Pixel` A Pixel object representing the entity, with a value of "E" and color green.
