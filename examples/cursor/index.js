import Runtime, { GameObject, Pixel, PixelMesh, Scene } from "../../index.js";

const runtime = new Runtime({
	seed: 234556,

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
	layers: [],
	// onLoad: (scene) => {},
	// onTick: (scene) => {},
});

// scene.inputManager.addEventListener("all", (e) => {
// 	console.log(e);
// });

const { width, height } = runtime.renderer;

const pointerPosition = new GameObject(scene, 0, 0, "system");
pointerPosition.renderable = new Pixel({ value: "#", color: "red" });

scene.inputManager.addEventListener("mousemove", ({ x, y }) => {
	pointerPosition.x = x;
	pointerPosition.y = y;

	pointerPosition.renderable = new PixelMesh({
		data: [
			[
				new Pixel({ value: "#", color: "red" }),

				...` ${x}, ${y}`.split("").map((value) => {
					return new Pixel({
						value,
						color: "red",
					});
				}),
			],
		],
	});
});

runtime.loadScene(scene);
