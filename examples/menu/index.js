import Runtime, { Menu, Scene, ScrollTo } from "../../index.js";

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
			label: "Option 1",
			callback: () => console.log("OPTION 1 SELECTED"),
		}),
		new Menu.Button({
			label: "Option 2",
			callback: () => console.log("OPTION 2 SELECTED"),
		}),
		new Menu.Button({
			label: "Option 3",
			callback: () => console.log("OPTION 3 SELECTED"),
		}),
		new Menu.Button({
			label: "Option 4",
			callback: () => console.log("OPTION 4 SELECTED"),
		}),
	],
	title: "Example Menu",
	layer: "system",
});

new ScrollTo(menu);

// new TextInput(scene, { x: 6, y: 8, layer: "system" });

runtime.loadScene(scene);
