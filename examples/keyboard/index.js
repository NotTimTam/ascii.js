import Runtime, {
	Box,
	GameObject,
	Pixel,
	Scene,
	ScrollTo,
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

const keyDisplay = (key) => {
	switch (key) {
		case "Escape":
			key = "Esc";
			break;
		case "ScrollLock":
			key = "ScrLk";
			break;
		case "Delete":
			key = "Del";
			break;
		case "PageDown":
			key = "PgDn";
			break;
		case "PageUp":
			key = "PgUp";
			break;
		case "Insert":
			key = "Ins";
			break;
		case " ":
			key = "   [_]   ";
			break;
		case "ArrowLeft":
			key = "←";
			break;
		case "ArrowRight":
			key = "→";
			break;
		case "ArrowUp":
			key = "↑";
			break;
		case "ArrowDown":
			key = "↓";
			break;
		case "Control":
			key = "Ctrl";
			break;
	}

	return key;
};

class Key extends GameObject {
	constructor(scene, layer, indX, indY, key, keyDisplay) {
		super(scene, indX, indY, layer);

		this.key = key;
		this.keyDisplay = keyDisplay;

		this.pressed = false;

		scene.inputManager.addEventListener("keydown", ({ keys, key }) => {
			if (keys[this.key] || key === this.key) this.pressed = true;
		});
		scene.inputManager.addEventListener("keyup", ({ keys, key }) => {
			if (!keys[this.key] || key === this.key) this.pressed = false;
		});
	}

	get renderable() {
		const box = Box.asPixelMesh(
			2 + this.keyDisplay.length,
			3,
			this.pressed ? "red" : "white",
			undefined,
			"line"
		);

		for (let i = 0; i < this.keyDisplay.length; i++) {
			const value = this.keyDisplay[i];

			box.data[1][1 + i] = new Pixel({
				value,
				color: this.pressed ? "red" : "white",
			});
		}

		return box;
	}
}

let lastX = 0;
`Escape!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!ScrollLock!Pause\n
\`!1!2!3!4!5!6!7!8!9!0!-!=!Backspace\n
Tab!q!w!e!r!t!y!u!i!o!p![!]!\\\n
spc!spc!spc!spc!spc!spc!a!s!d!f!g!h!j!k!l!;!'!Enter\n
spc!Shift!z!x!c!v!b!n!m!,!.!/!Shift!ArrowUp\n
Control!Alt! !Alt!Control!spc!spc!spc!spc!spc!spc!spc!spc!spc!ArrowLeft!ArrowDown!ArrowRight`
	.trim()
	.split("\n")
	.filter((row) => row)
	.forEach((row, indY) => {
		lastX = 0;
		row.trim()
			.split("!")
			.forEach((key) => {
				if (key === "spc") {
					lastX += 1;
					return;
				}
				const keyDsp = keyDisplay(key);
				let indX = lastX;
				lastX += 2 + keyDsp.length;
				const keyObject = new Key(
					scene,
					"system",
					indX,
					indY * 3,
					key,
					keyDsp
				);

				if (key === "h") new ScrollTo(scene, keyObject, true);
			});
	});

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
