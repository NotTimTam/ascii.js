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
	y: mouseDisplay.y + 1,
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
leftClickIndicator.renderable = PixelMesh.fromString(
	`    _.8
  .'  |
 /    |
|     
|     |
|-----'`
);
leftClickIndicator.renderable.setBackgroundColor("red");
leftClickIndicator.visible = false;

const rightClickIndicator = new GameObject(
	scene,
	mouseDisplay.x + 3,
	mouseDisplay.y - 6,
	"system"
);
rightClickIndicator.renderable = PixelMesh.fromString(
	`8._
|  '.
|    \\
      |
|     |
'-----|`
);
rightClickIndicator.renderable.setBackgroundColor("red");
rightClickIndicator.visible = false;

const middleClickIndicator = new GameObject(
	scene,
	mouseDisplay.x + 2,
	mouseDisplay.y - 3,
	"system"
);
middleClickIndicator.renderable = PixelMesh.fromString(`[_]`);
middleClickIndicator.renderable.setBackgroundColor("red");
middleClickIndicator.visible = false;

// Scroll indicators.
const scrollIndicator = new GameObject(
	scene,
	mouseDisplay.x + 3,
	mouseDisplay.y - 3,
	"system"
);
scrollIndicator.renderable = Pixel.fromString(` `);

scene.inputManager.addEventListener("wheel", ({ scroll: { y } }) => {
	if (y === "up") scrollIndicator.renderable.value = "↑";
	else scrollIndicator.renderable.value = "↓";
});

scene.onTickPassthrough = () => {
	const {
		mouse: {
			buttons: { left, right, middle },
		},
	} = scene.inputManager;

	// console.log(deltas, scroll);

	if (left) leftClickIndicator.visible = true;
	else leftClickIndicator.visible = false;

	if (right) rightClickIndicator.visible = true;
	else rightClickIndicator.visible = false;

	if (middle) middleClickIndicator.visible = true;
	else middleClickIndicator.visible = false;

	scrollIndicator.renderable = Pixel.fromString(` `);
};

runtime.loadScene(scene);
