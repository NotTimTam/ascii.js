import Runtime, {
	Menu,
	Scene,
	ScrollTo,
} from "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/build.js";

const runtime = new Runtime({
	renderer: {
		resolution: [96, 32],

		canvas: document.querySelector("canvas.display"),

		fontSize: "24px",
		scaling: "letterbox",

		renderMode: "stacked",
	},
});

runtime.start();

const scene = new Scene(runtime, {
	label: "game",
	layers: [{ label: "BOTTOM" }, { label: "TOP" }],
});

new Menu(scene, {
	x: 0,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button A",
		}),
		new Menu.Button({
			label: "Button B",
		}),
		new Menu.Button({
			label: "Button C",
		}),
	],
	title: "Menu 1",
	layer: "system",
	gamepad: -1,
});

const menuCenter = new Menu(scene, {
	x: 14,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button D",
		}),
		new Menu.Button({
			label: "Button E",
		}),
		new Menu.Button({
			label: "Button F",
		}),
	],
	title: "Menu 2",
	layer: "system",
	gamepad: -1,
});

new Menu(scene, {
	x: 28,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button G",
		}),
		new Menu.Button({
			label: "Button H",
		}),
		new Menu.Button({
			label: "Button I",
		}),
	],
	title: "Menu 3",
	layer: "system",
	gamepad: -1,
});

new ScrollTo(menuCenter);

runtime.loadScene(scene);
