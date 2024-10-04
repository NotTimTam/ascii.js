import Runtime, { Scene } from "../../index.js";
import GameObject from "../core/GameObject.js";
import Text from "../objects/Text.js";

const runtime = new Runtime({
	renderer: {
		resolution: [64, 32],

		canvas: document.querySelector("canvas"),

		fontSize: "32px",
		scaling: "letterbox",

		renderMode: "stacked",
	},
});

runtime.start((runtime) => {});

const scene = new Scene(runtime, {
	label: "game",
	layers: [],
	// onLoad: (scene) => {},
	// onTick: (scene) => {},
});

const loader = new GameObject(scene, 0, 0, "system");

new Text(scene, {
	x: loader.x,
	y: loader.y + loader.height,
	value: "ascii.js",
	layer: "system",
});

runtime.loadScene(scene);
