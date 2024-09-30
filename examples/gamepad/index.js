import Runtime, {
	GameObject,
	Pixel,
	PixelMesh,
	Scene,
	ScrollTo,
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
	layers: [
		{
			label: "shoulders",
		},
	],
});

const controllerText = `      _=====_                              _=====_
     / _____ \\                            / _____ \\
   +.-'_____'-.--------------------------.-'_____'-.+
  /   |     |  '.                      .'  |     |   \\
 / ___| /|\\ |___ \\                    / ___|  Y  |___ \\
; |      |      | ;  __          __  ; |             | ;
| | <---   ---> | | |__|        |__| | | X         B | |
; |___   |   ___| ;                  ; |___       ___| ;
|\\    | \\|/ |    /  _              _  \\    |  A  |    /|
| \\   |_____|  .','" "',        ,'" "','.  |_____|  .' |
|  '-.______.-' /       \\      /       \\  '-._____.-'  |
|               |       |------|       |               |
|              /\\       /      \\       /\\              |
|             /  '.___.'        '.___.'  \\             |
|            /                            \\            |
 \\          /                              \\          /
  \\________/                                \\________/`;

const backdrop = new Text(scene, {
	x: 0,
	y: 0,
	color: "grey",
	value: "",
	layer: "system",
});

new ScrollTo(scene, backdrop, true);

let activeGamepad = 0;

class ControllerSelector extends Text {
	constructor(scene, config) {
		super(scene, config);

		this.index = config.index;

		scene.inputManager.watchObjectClick(this.id, ({ onLayer }) => {
			activeGamepad = this.index;

			showGamepad();
		});

		this.updateDisplay();
	}

	get connected() {
		return scene.inputManager.gamepads[this.index];
	}

	updateDisplay() {
		this.value = `${this.index + 1}: ${
			this.connected ? this.connected.id : "No gamepad connected."
		}`;
		this.color =
			activeGamepad === this.index
				? this.connected
					? "green"
					: "red"
				: "grey";
	}
}

const selections = [
	new ControllerSelector(scene, {
		x: -20,
		y: -7,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 0,
	}),
	new ControllerSelector(scene, {
		x: -20,
		y: -6,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 1,
	}),
	new ControllerSelector(scene, {
		x: -20,
		y: -5,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 2,
	}),
	new ControllerSelector(scene, {
		x: -20,
		y: -4,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 3,
	}),
];

function showGamepad() {
	const exists = scene.inputManager.gamepads[activeGamepad];

	if (!exists) {
		backdrop.value = `           NO CONTROLLER IN SLOT ${
			activeGamepad + 1
		}.\nConnect a controller and then select it above.`;
	} else {
		backdrop.value = controllerText;
	}

	for (const selection of selections) {
		selection.updateDisplay();
	}
}

showGamepad();

scene.inputManager.addEventListener("gamepadconnected", showGamepad);
scene.inputManager.addEventListener("gamepaddisconnected", showGamepad);

class Button extends GameObject {
	constructor(scene, x, y, layer, getRenderable) {
		super(scene, x, y, layer);

		this.getRenderable = getRenderable;
	}

	get renderable() {
		return this.getRenderable(this.scene);
	}
}

new Button(scene, 46, 8, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.a.pressed
		? new Pixel({ value: "A", color: "lime", fontWeight: 800 })
		: null;
});
new Button(scene, 51, 6, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.b.pressed
		? new Pixel({ value: "B", color: "red", fontWeight: 800 })
		: null;
});
new Button(scene, 41, 6, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.x.pressed
		? new Pixel({ value: "X", color: "dodgerblue", fontWeight: 800 })
		: null;
});
new Button(scene, 46, 4, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.y.pressed
		? new Pixel({ value: "Y", color: "yellow", fontWeight: 800 })
		: null;
});
new Button(scene, 8, 4, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.up.pressed
		? new PixelMesh({
				data: "/|\\\n |"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 8, 7, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.down.pressed
		? new PixelMesh({
				data: " |\n\\|/"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 4, 6, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.left.pressed
		? new PixelMesh({
				data: [
					"<---".split("").map((value) => Pixel.fromString(value)),
				],
		  })
		: null;
});
new Button(scene, 11, 6, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.right.pressed
		? new PixelMesh({
				data: [
					"--->".split("").map((value) => Pixel.fromString(value)),
				],
		  })
		: null;
});
new Button(scene, 20, 5, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.select.pressed
		? new PixelMesh({
				data: " __\n|__|"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 32, 5, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.start.pressed
		? new PixelMesh({
				data: " __\n|__|"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 5, 1, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.l1.pressed
		? new PixelMesh({
				data: "  _____\n-'     '-"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 42, 1, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.r1.pressed
		? new PixelMesh({
				data: "  _____\n-'     '-"
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 5, 0, "shoulders", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.l2.pressed
		? new PixelMesh({
				data: ` _=====_\n/ ${gamepad.buttons.l2.value
					.toFixed(3)
					.toString()
					.padEnd(6, " ")}\\`
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 42, 0, "shoulders", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.r2.pressed
		? new PixelMesh({
				data: ` _=====_\n/ ${gamepad.buttons.r2.value
					.toFixed(3)
					.toString()
					.padEnd(6, " ")}\\`
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 16, 8, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.l3.pressed
		? new PixelMesh({
				data: `    _
 ,'" "',
/       \\
|       |
\\       /
 '.___.'  `
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});

new Button(scene, 31, 8, "system", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad && gamepad.buttons.r3.pressed
		? new PixelMesh({
				data: `    _
 ,'" "',
/       \\
|       |
\\       /
 '.___.'  `
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});

new Button(scene, 17, 10, "shoulders", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad
		? new PixelMesh({
				data: `H ${gamepad.axes.lh.toFixed(
					2
				)}\n\nV ${gamepad.axes.lv.toFixed(2)}`
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});
new Button(scene, 32, 10, "shoulders", (scene) => {
	const gamepad = selections[activeGamepad].connected;
	return gamepad
		? new PixelMesh({
				data: `H ${gamepad.axes.rh.toFixed(
					2
				)}\n\nV ${gamepad.axes.rv.toFixed(2)}`
					.split("\n")
					.map((row) =>
						row.split("").map((value) => Pixel.fromString(value))
					),
		  })
		: null;
});

runtime.loadScene(scene);
