import Runtime, {
	GameObject,
	Pixel,
	PixelMesh,
	Scene,
	Text,
} from "../../index.js";

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

new Text(scene, {
	x: 0,
	y: height - 1,
	value: "Mouse by Joan G. Stark",
	layer: "system",
});

const mouseDisplay = new GameObject(scene, 0, 0, "system");
mouseDisplay.renderable = new PixelMesh({
	data: `    ,d88b
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

mouseDisplay.x = width / 2;
mouseDisplay.y = height / 2;

// Pointer position indicator.
const pointerPosition = new Text(scene, {
	x: mouseDisplay.x,
	y: mouseDisplay.y,
	layer: "system",
	value: "",
	color: "red",
});
pointerPosition.renderable = undefined;

scene.inputManager.addEventListener("mousemove", ({ x, y }) => {
	pointerPosition.value = ` ${x}, ${y}`;
});

// Click indicators.
const leftClickIndicator = new GameObject(
	scene,
	mouseDisplay.x - 3,
	mouseDisplay.y - 6,
	"system"
);
leftClickIndicator.renderable = PixelMesh.fromString(` 8'       _.8._
8       .'  |  '.
       /    |    \\
      |    [_]    |
      |     |     |
      |-----'-----|`);

// Scroll indicators.

runtime.loadScene(scene);
