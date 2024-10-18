import Runtime, { Menu, Scene, ScrollTo, Text } from "../../../index.js";

// "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/build.js";

const runtime = new Runtime({
	renderer: {
		resolution: [96, 32],

		canvas: document.querySelector("canvas.display"),

		fontSize: "24px",
		scaling: "letterbox",

		renderMode: "stacked",
	},
});

runtime.start((runtime) => {});

const scene = new Scene(runtime, {
	label: "game",
});

const menu = new Menu(scene, {
	x: 0,
	y: 0,
	items: [
		new Menu.Button({
			label: "Reload Objects",
			// callback: () => console.log("RELOAD BUTTON PRESSED"),
		}),
	],
	title: "Example Menu",
	layer: "system",
	gamepad: -1,
});

new ScrollTo(menu);

const message = new Text(scene, {
	x: 0,
	y: menu.y + menu.height,
	value: "Check console for input results.",
	layer: "system",
});
message.x = menu.x + (menu.width / 2 - message.value.length / 2);

runtime.loadScene(scene);
