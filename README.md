# ascii-engine

An ascii-based 2d-canvas-rendered game engine.

## Todo

-   Objects

    -   [x] Core
    -   [x] GameObject
        -   [x] Entity
        -   [x] Area
        -   [x] Text
        -   [x] Box
        -   [x] Menu
            -   [ ] Slider
            -   [ ] Toggle
            -   [ ] Button

-   Save/Load system?
-   Controller support.
-   Performance improvements.

    -   Fully implement web workers.

-   Export utilities.
-   UI Tools / Documentation.

## Pixels?

The engine treats individual characters on the screen as "pixels."

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
