import Runtime from "./engine/runtime.js";
import Player from "./game/Player.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [16 * 5, 9 * 5],

		fontSize: "64px",
		scaling: "letterbox",

		layerManager: {
			layers: ["environment", "entities", "overlay", "ui"],
		},

		camera: {},
	},
});

window.runtime.start();

// Create base gameObjects and run their startups.
const player = new Player(window.runtime, 0, 0);

player.layer = "entities";
