# ascii-engine

## Todo

-   Objects

    -   [ ] Core
    -   [ ] GameObject
        -   [ ] Entity
        -   [ ] Area
        -   [ ] Text
        -   [ ] Box
        -   [ ] Menu
            -   [ ] Slider
            -   [ ] Toggle
            -   [ ] Button
        -   [ ] Particles

-   Behaviours

    -   [ ] Scroll To
    -   [ ] 8 Direction
    -   [ ] Animate
    -   [ ] Bullet
    -   [ ] Car
    -   [ ] Pin

-   Save/Load system?
-   Controller support.
-   Audio support.
-   Export utilities.
-   UI Tools / Documentation

## Render Modes

The renderer has a `"renderMode"` option that determines how it operates.

### Stacked Mode

-   **Description:** Draws each layer in order, stacked on top of each other.
-   **Behavior:** Layers are drawn one on top of the other, allowing characters to overlap.
-   **Performance:** More expensive due to multiple render calls, but offers higher quality graphics.

### Merged Mode

-   **Description:** Compiles all layer frames into a single frame before rendering.
-   **Behavior:** Characters cannot overlap as all layers are combined into one frame.
-   **Performance:** Faster rendering compared to stacked mode due to the compilation of all frames. Additionally, identifies and skips rendering frames that are identical to the currently drawn frame, saving processing time when the screen is static. Due to the nature of this rendering mode, some graphical issues can occur, and it should only be used on lower-end devices.
