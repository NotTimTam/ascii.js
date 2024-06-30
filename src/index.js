import Runtime from "./engine/runtime.js";

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
	const {
		renderer: { width, height },
	} = runtime;

	const menu = new Menu(runtime, {
		x: 0,
		y: 0,
		title: "Paused",
		options: {
			option1: "Option 1",
			option2: "Option 2",
			option3: "Option 3",
			option4: "Option 4",
			option5: "Option 5",
			option6: "Option 6",
			option7: "Option 7",
			option8: "Option 8",
			option9: "Option 9",
			option10: "Option 10",
			option12: "Option 12",
			option13: "Option 13",
			option14: "Option 14",
			option15: "Option 15",
			option16: "Option 16",
			option17: "Option 17",
			option18: "Option 18",
			option19: "Option 19",
			option20: "Option 20",
			option21: "Option 21",
			option22: "Option 22",
			option23: "Option 23",
			option24: "Option 24",
			option25: "Option 25",
			option26: "Option 26",
			option27: "Option 27",
			option28: "Option 28",
			option29: "Option 29",
			option30: "Option 30",
			option31: "Option 31",
			option32: "Option 32",
			option33: "Option 33",
			option34: "Option 34",
			option35: "Option 35",
			option36: "Option 36",
			option37: "Option 37",
			option38: "Option 38",
			option39: "Option 39",
		},
	});
	menu.layer = "ui";
	menu.x = width / 2 - menu.width / 2;
	menu.y = height / 2 - menu.height / 2;

	// // Create base gameObjects and run their startups.
	// const player = new Player(runtime, 3, 2);
	// player.layer = "entities";
	// const size = 512;
	// const grassPatch = new GrassPatch(
	// 	runtime,
	// 	-Math.round(size / 2),
	// 	-Math.round(size / 2),
	// 	size,
	// 	size
	// );
	// grassPatch.layer = "background";
	// const room = new Room(runtime, 0, 0, [
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	// 	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	// 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	// ]);
	// room.layer = "environment";
	// /**
	//  *
	//  *
	//  *
	//  *
	//  *
	//  *
	//  *
	//  *
	//  */
	// const devNotice = new Text(
	// 	runtime,
	// 	0,
	// 	runtime.renderer.height - 1,
	// 	"ALPHA BUILD! BUGS MAY OCCUR",
	// 	false
	// );
	// devNotice.layer = "ui";
	// const fpsText = new Text(runtime, 0, 0, String(runtime.fps), false);
	// fpsText.layer = "ui";
	// fpsText.prevFPS = [];
	// fpsText.__onTick = () => {
	// 	fpsText.prevFPS.push(runtime.fps);
	// 	while (fpsText.prevFPS.length > 100) fpsText.prevFPS.shift();
	// 	fpsText.text = String(
	// 		Math.round(
	// 			fpsText.prevFPS.reduce((p, c) => p + c) / fpsText.prevFPS.length
	// 		)
	// 	);
	// };
});
