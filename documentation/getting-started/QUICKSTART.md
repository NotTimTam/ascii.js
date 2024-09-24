# Quick Start

Welcome to the ascii.js documentation! This page will give you an introduction to ascii.js and its core components.

## Environment Configuration

ascii.js has no library dependencies and will work in essentially any JS environment.

To install the source code into your project, view the [Installation Guide](./INSTALLATION.md).

---

## Creating the Runtime

ascii.js uses a `Runtime` object to manage your project's `Scene`s, `GameObject`s, user inputs, and more.

```js
import Runtime from "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/bundle.esm.js";

const runtime = new Runtime({
	seed: 234556, // Seed for random number generation.

	renderer: {
		resolution: [96, 32], // Character-based display resolution.

		canvas: document.querySelector("canvas.display"), // The canvas element to display on.

		fontSize: "32px",
		scaling: "letterbox",

		renderMode: "stacked", // "stacked" or "merged"
	},
});

runtime.start(); // Start the runtime gameloop.

// Create a scene.
const scene myScene= new Scene({
	label: "development",
	layers: [
		{
			label: "entities",
			gameObjectConstructors: [],
		},
	],
	onLoad: () => {},
	onTick: () => {},
});

runtime.loadScene(scene);
```

## Next Steps

To learn more about the many features of ascii.js, start with the [Module Exports](../learn/MODULE.md).
