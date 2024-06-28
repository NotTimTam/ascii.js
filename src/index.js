import Runtime from "./engine/runtime.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [16 * 5, 9 * 5],

		fontSize: "64px",
		scaling: "letterbox",

		layerManager: {
			layers: ["environment", "entities", "overlay", "ui"],
		},
	},
});

window.runtime.start();
