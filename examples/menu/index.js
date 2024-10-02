import Runtime, { Scene, TextInput } from "../../index.js";

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

// const menu = new Menu(scene, {
// 	x: 0,
// 	y: 0,
// 	options: [],
// 	callback: (e) => {
// 		console.log(e);
// 	},
// 	layer: "system",
// });

new TextInput(scene, { x: 6, y: 8, layer: "system" });

runtime.loadScene(scene);
