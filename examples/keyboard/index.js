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
		case "escape":
			key = "Esc";
			break;
		case "scrolllock":
			key = "ScrLk";
			break;
		case "delete":
			key = "Del";
			break;
		case "tab":
			key = "Tab";
			break;
		case "pause":
			key = "Pause";
			break;
		case "pagedown":
			key = "PgDn";
			break;
		case "shift":
			key = "Shift";
			break;
		case "alt":
			key = "Alt";
			break;
		case "pageup":
			key = "PgUp";
			break;
		case "insert":
			key = "Ins";
			break;
		case "space":
			key = "       [_]       ";
			break;
		case "left":
			key = "←";
			break;
		case "right":
			key = "→";
			break;
		case "up":
			key = "↑";
			break;
		case "down":
			key = "↓";
			break;
		case "control":
			key = "Ctrl";
			break;
		case "=":
			key = "=+";
			break;
		case "-":
			key = "-_";
			break;
	}

	return key;
};

class Key extends GameObject {
	constructor(scene, layer, indX, indY, key, keyDisplay) {
		super(scene, indX, indY, layer);

		this.key = key;
		this.keyDisplay = keyDisplay;
	}

	get renderable() {
		const pressed = this.scene.inputManager.keyboard.keys[this.key];
		const box = Box.asPixelMesh(
			2 + this.keyDisplay.length,
			3,
			pressed ? "red" : "white",
			undefined,
			"line"
		);

		for (let i = 0; i < this.keyDisplay.length; i++) {
			const value = this.keyDisplay[i];

			box.data[1][1 + i] = new Pixel({
				value,
				color: pressed ? "red" : "white",
			});
		}

		return box;
	}
}

let lastX = 0;
`escape!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!spc!scrolllock!pause\n
\`!1!2!3!4!5!6!7!8!9!0!-!=!backspace\n
tab!q!w!e!r!t!y!u!i!o!p![!]!\\!delete\n
spc!spc!spc!spc!spc!spc!a!s!d!f!g!h!j!k!l!;!'!enter\n
spc!shift!z!x!c!v!b!n!m!,!.!/!shift!up\n
spc!control!alt!space!alt!control!left!down!right`
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
