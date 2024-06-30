import Runtime from "./engine/runtime.js";
import Player from "./game/Player.js";
import GrassPatch from "./game/GrassPatch.js";
import Room from "./game/Room.js";
import Menu from "./extensions/Menu.js";

window.runtime = new Runtime({
	renderer: {
		resolution: [96, 32],

		fontSize: "32px",
		scaling: "letterbox",

		renderMode: "stacked", // "stacked" or "merged"

		layerManager: {
			layers: [
				{ label: "background" },
				{ label: "environment" },
				{ label: "entities" },
				{ label: "overlay" },
				{ label: "ui", parallax: [0, 0] },
			],
		},

		camera: {},
	},
});

window.runtime.start((runtime) => {
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

	const {
		renderer: { width, height },
	} = runtime;

	const initialOptions = {
		resume: "Resume",
		settings: "Settings",
		// quit: "Quit",
	};

	const menu = new Menu(runtime, {
		x: 0,
		y: 0,
		title: "Paused",
		options: initialOptions,
		callback: (option) => {
			console.log(option);
			// menu.index = 0;

			switch (option) {
				case "resume":
					player.layer.paused = false;
					break;
				case "settings":
					menu.index = 0;
					menu.options = {
						test: "Test",
						back: "Back",
					};
					break;
				case "quit":
					// window.location = "about:blank";
					break;
				case "back":
					menu.index = 0;
					menu.options = initialOptions;
					break;
				case "test":
					alert("This is a test...");
					break;
			}
		},
	});
	menu.layer = "ui";

	menu.__onTick = () => {
		if (player.layer.paused) menu.visible = true;
		else menu.visible = false;

		menu.x = width / 2 - menu.width / 2;
		menu.y = height / 2 - menu.height / 2;
	};

	// Create base gameObjects and run their startups.

	grassPatch.layer = "background";
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
	 */
	const devNotice = new Text(
		runtime,
		0,
		runtime.renderer.height - 1,
		"ALPHA BUILD! BUGS MAY OCCUR",
		false
	);
	devNotice.layer = "ui";
	const fpsText = new Text(runtime, 0, 0, String(runtime.fps), false);
	fpsText.layer = "ui";
	fpsText.prevFPS = [];
	fpsText.__onTick = () => {
		fpsText.prevFPS.push(runtime.fps);
		while (fpsText.prevFPS.length > 100) fpsText.prevFPS.shift();
		fpsText.text = String(
			Math.round(
				fpsText.prevFPS.reduce((p, c) => p + c) / fpsText.prevFPS.length
			)
		);
	};
});
