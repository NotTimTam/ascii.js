# ascii.js

[![Build and Release](https://github.com/NotTimTam/ascii.js/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/NotTimTam/ascii.js/actions/workflows/release.yml)

An ascii-based 2d-canvas-rendered game engine.

## Documentation

[Read the documentation](./docs/INDEX.md), or explore it with an [app built in ascii.js](https://nottimtam.github.io/ascii.js/).

## Todo

- Improve `Menu.Slider` and `Scroller` so the slider/scrollbars can keep being dragged if the mouse leaves the menu.
- Add menu & scroller color/style configuration.
- Fix performance degredation caused by advanced InputManager logic and the addition of UIObjects.
- Fix scrollbar layout.
- CTX font family control.
- Click + drag pointer capture, so that moving the mouse off of an object doesn't blur it until the cursor is released. This could be as simple as only triggering blur events when the mouse is released, instead of when it is "clicked" (a full press + release)
