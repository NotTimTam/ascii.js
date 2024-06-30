import Runtime from "./engine/runtime.js";
import Entity from "./core/Entity.js";
import GrassPatch from "./game/GrassPatch.js";
import Player from "./game/Player.js";
import Room from "./game/Room.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [16 * 5, 9 * 3],

		fontSize: "48px",
		scaling: "letterbox",

		renderMode: "merged", // "stacked" or "merged"

		layerManager: {
			layers: ["background", "environment", "entities", "overlay", "ui"],
		},

		camera: {},
	},
});

window.runtime.start((runtime) => {
	// Create base gameObjects and run their startups.
	const player = new Player(runtime, 3, 2);
	player.layer = "entities";

	const size = 512;
	const grassPatch = new GrassPatch(
		runtime,
		-Math.round(size / 2),
		-Math.round(size / 2),
		size,
		size
	);
	grassPatch.layer = "environment";

	const room = new Room(runtime, 0, 0, [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	]);
	room.layer = "environment";

	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 */

	const fpsDisplay = document.createElement("div");
	fpsDisplay.className = "fps-display";
	document.body.appendChild(fpsDisplay);

	let pastFPS = [];

	const dev = new Entity(runtime, 0, 0);
	dev.__onTick = () => {
		pastFPS.push(runtime.fps);

		while (pastFPS.length > 25) pastFPS.shift();

		fpsDisplay.innerHTML = runtime.paused
			? "PAUSED"
			: `${Math.round(
					pastFPS.reduce((p, c) => p + c) / pastFPS.length
			  )}FPS`;
	};
});
