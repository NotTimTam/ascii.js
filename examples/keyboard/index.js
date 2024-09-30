import Runtime, {
	Box,
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

class Key extends GameObject {
	constructor(scene, x, y, layer, key) {
		super(scene, x, y, layer);

		this.key = key;

		this.pressed = false;

		scene.inputManager.addEventListener("keydown", ({ keys }) => {
			if (keys[this.key]) this.pressed = true;
		});
		scene.inputManager.addEventListener("keyup", ({ keys }) => {
			if (!keys[this.key]) this.pressed = false;
		});
	}

	get renderable() {
		const box = Box.asPixelMesh(
			2 + this.key.length,
			3,
			"white",
			undefined,
			"line"
		);

		for (let i = 0; i < this.key.length; i++) {
			const char = this.key[i];

			box.data[1][1 + i] = Pixel.fromString(char);
		}

		return box;
	}
}

new Key(scene, 0, 0, "system", "a");

// const scrollIndicator = new GameObject(
// 	scene,
// 	mouseDisplay.x + 3,
// 	mouseDisplay.y - 3,
// 	"system"
// );
// scrollIndicator.renderable = Pixel.fromString(` `);

// scene.onTickPassthrough = () => {
// 	const {
// 		mouse: {
// 			buttons: { left, right, middle },
// 		},
// 	} = scene.inputManager;

// 	// console.log(deltas, scroll);

// 	if (left) leftClickIndicator.visible = true;
// 	else leftClickIndicator.visible = false;

// 	if (right) rightClickIndicator.visible = true;
// 	else rightClickIndicator.visible = false;

// 	if (middle) middleClickIndicator.visible = true;
// 	else middleClickIndicator.visible = false;

// 	scrollIndicator.renderable = Pixel.fromString(` `);
// };

runtime.loadScene(scene);
