import Runtime from "./engine/runtime.js";
import Entity from "./game/Entity.js";
import Player from "./game/Player.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [16 * 5, 9 * 5],

		fontSize: "32px",
		scaling: "letterbox",

		layerManager: {
			layers: ["background", "environment", "entities", "overlay", "ui"],
		},

		camera: {},
	},
});

window.runtime.start((runtime) => {
	// Create base gameObjects and run their startups.
	const player = new Player(window.runtime, 0, 0);
	player.layer = "entities";
	const rando = new Entity(window.runtime, 0, 0);
});
