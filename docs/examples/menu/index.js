import Runtime, { Menu, Scene, ScrollTo, Text } from "../../../index.js";

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

let avg = [];
const scene = new Scene(runtime, {
	label: "game",
	// onTick: () => {
	// 	avg.push(runtime.fps);

	// 	while (avg.length > 30) {
	// 		avg.shift();
	// 	}

	// 	console.log(avg.reduce((a, b) => a + b) / avg.length);
	// },
});

const { width, height } = runtime.renderer;

const menu = new Menu(scene, {
	x: 0,
	y: 0,
	items: [
		new Menu.Button({
			label: "Reload Objects",
			callback: () => console.log("RELOAD BUTTON PRESSED"),
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
		new Menu.Toggle({
			label: "Mute Audio",
			callback: (checked) =>
				console.log("CHECKBOX", checked ? "CHECKED" : "UNCHECKED"),
		}),
		new Menu.Button({
			label: "Save Changes",
			callback: () => console.log("SAVE BUTTON PRESSED"),
		}),
		new Menu.Button({
			label: "Exit",
			callback: () => console.log("EXIT BUTTON PRESSED"),
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
