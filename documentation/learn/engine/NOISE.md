# Noise

A perlin/simplex noise generator.

---

## Constructor

```javascript
new Noise(seed);
```

### Arguments

-   `seed` &mdash; `number` The seed for noise generation.

---

## Methods

### simplex2(xin, yin)

Generate a 2D simplex noise value.

#### Arguments

-   `xin` &mdash; `number` The x-coordinate.
-   `yin` &mdash; `number` The y-coordinate.

#### Returns

The random noise for the provided coordinates.

### simplex3(xin, yin, zin)

Generate a 3D simplex noise value.

#### Arguments

-   `xin` &mdash; `number` The x-coordinate.
-   `yin` &mdash; `number` The y-coordinate.
-   `zin` &mdash; `number` The z-coordinate.

#### Returns

The random noise for the provided coordinates.

### perlin2(x, y)

Generate a 2D perlin noise value.

#### Arguments

-   `x` &mdash; `number` The x-coordinate.
-   `y` &mdash; `number` The y-coordinate.

#### Returns

The random noise for the provided coordinates.

### perlin3(x, y, z)

Generate a 3D perlin noise value.

#### Arguments

-   `x` &mdash; `number` The x-coordinate.
-   `y` &mdash; `number` The y-coordinate.
-   `z` &mdash; `number` The z-coordinate.

#### Returns

The random noise for the provided coordinates.
