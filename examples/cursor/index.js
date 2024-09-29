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

const { width, height } = runtime.renderer;

const pointerPosition = new GameObject(scene, 0, 0, "system");
pointerPosition.renderable = new Pixel({ value: "#", color: "red" });

const mouseDisplay = new GameObject(scene, 0, 0, "system");
mouseDisplay.renderable = new PixelMesh({
	data: `Art by Joan G. Stark
    ,d88b
 ,8P'    \`8,
 8'       _.8._
8       .'  |  '.
       /    |    \\
      |    [_]    |
      |     |     |
      |-----'-----|
      |           |
      |           |
      |;         .|
      ;\\         /;
       \\\\       //
        \\'._ _.'/
         '-...-'
`
		.split("\n")
		.map((line) =>
			line.split("").map(
				(value) =>
					new Pixel({
						value,
					})
			)
		),
});
mouseDisplay.renderable.origin = [
	Math.floor(mouseDisplay.renderable.width / 2),
	Math.floor(mouseDisplay.renderable.height / 2),
];

console.log(mouseDisplay.renderable);

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
