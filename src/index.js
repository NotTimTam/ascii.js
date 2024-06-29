import Runtime from "./engine/runtime.js";
import Area from "./game/Area.js";
import Entity from "./game/Entity.js";
import GrassPatch from "./game/GrassPatch.js";
import Player from "./game/Player.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [16 * 3, 9 * 3],

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
	const player = new Player(runtime, 1, 0);
	player.layer = "entities";

	const grassPatch = new GrassPatch(runtime, 0, 0, 64, 64);
	grassPatch.layer = "environment";
});
