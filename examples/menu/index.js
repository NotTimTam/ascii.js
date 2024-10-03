import Runtime, { Menu, Scene, ScrollTo, Text } from "../../index.js";

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

const { width, height } = runtime.renderer;

const menu = new Menu(scene, {
	x: 0,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button 1",
			callback: () => console.log("OPTION 1 SELECTED"),
		}),
		new Menu.Button({
			label: "Button 2",
			callback: () => console.log("OPTION 2 SELECTED"),
		}),
		new Menu.Slider({
			value: 0,
			min: 0,
			max: 10,
			step: 1,
			label: "Volume",
			showValue: false,
			showPercentage: true,
			onChange: (v) => {
				console.log("CHANGED", v);
			},
			callback: (v) => console.log("ENTER ON SLIDER", v),
		}),
		new Menu.Button({
			label: "Button 3",
			callback: () => console.log("OPTION 3 SELECTED"),
		}),
		new Menu.Button({
			label: "Button 4",
			callback: () => console.log("OPTION 4 SELECTED"),
		}),

		new Menu.Toggle({
			label: "Random Checkbox",
			callback: (checked) =>
				console.log("CHECKBOX", checked ? "CHECKED" : "UNCHECKED"),
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
