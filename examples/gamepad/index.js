import Runtime, {
	GameObject,
	Pixel,
	PixelMesh,
	Scene,
	Text,
} from "../../index.js";

let showingRaw = false;

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

const { width, height } = runtime.renderer;

class Button extends GameObject {
	constructor(scene, gamepadDisplay, layer, x, y, getRenderable) {
		x = gamepadDisplay.x + x;
		y = gamepadDisplay.y + y;

		super(scene, x, y, layer);

		this.gamepadDisplay = gamepadDisplay;

		this.getRenderable = getRenderable;
	}

	get gamepad() {
		return selections[this.gamepadDisplay.index].connected;
	}

	get renderable() {
		return this.getRenderable(this.gamepad);
	}
}

class GamepadDisplay extends Text {
	constructor(scene, config) {
		config.value = `      _=====_                              _=====_
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

		super(scene, config);

		this.index = config.index;

		this.buttonConstructors = [
			[
				46,
				8,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.a.pressed
						? new Pixel({
								value: "A",
								color: "lime",
								fontWeight: 800,
						  })
						: null;
				},
			],
			[
				51,
				6,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.b.pressed
						? new Pixel({
								value: "B",
								color: "red",
								fontWeight: 800,
						  })
						: null;
				},
			],
			[
				41,
				6,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.x.pressed
						? new Pixel({
								value: "X",
								color: "dodgerblue",
								fontWeight: 800,
						  })
						: null;
				},
			],
			[
				46,
				4,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.y.pressed
						? new Pixel({
								value: "Y",
								color: "yellow",
								fontWeight: 800,
						  })
						: null;
				},
			],
			[
				8,
				4,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.up.pressed
						? new PixelMesh({
								data: "/|\\\n |"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				8,
				7,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.down.pressed
						? new PixelMesh({
								data: " |\n\\|/"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				4,
				6,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.left.pressed
						? new PixelMesh({
								data: [
									"<---"
										.split("")
										.map((value) =>
											Pixel.fromString(value)
										),
								],
						  })
						: null;
				},
			],
			[
				11,
				6,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.right.pressed
						? new PixelMesh({
								data: [
									"--->"
										.split("")
										.map((value) =>
											Pixel.fromString(value)
										),
								],
						  })
						: null;
				},
			],
			[
				20,
				5,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.select.pressed
						? new PixelMesh({
								data: " __\n|__|"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				32,
				5,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.start.pressed
						? new PixelMesh({
								data: " __\n|__|"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				5,
				1,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.l1.pressed
						? new PixelMesh({
								data: "  _____\n-'     '-"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				42,
				1,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.r1.pressed
						? new PixelMesh({
								data: "  _____\n-'     '-"
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				5,
				0,
				"shoulders",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.l2.pressed
						? new PixelMesh({
								data: ` _=====_\n/ ${gamepad.buttons.l2.value
									.toFixed(3)
									.toString()
									.padEnd(6, " ")}\\`
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				42,
				0,
				"shoulders",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.r2.pressed
						? new PixelMesh({
								data: ` _=====_\n/ ${gamepad.buttons.r2.value
									.toFixed(3)
									.toString()
									.padEnd(6, " ")}\\`
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				13,
				8,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.l3.pressed
						? new PixelMesh({
								data: `       _
			 ,'" "',
			/       \\
			|       |
			\\       /
			 '.___.'  `
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],

			[
				28,
				8,
				"system",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw &&
						gamepad.buttons.r3.pressed
						? new PixelMesh({
								data: `       _
			 ,'" "',
			/       \\
			|       |
			\\       /
			 '.___.'  `
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],

			[
				17,
				10,
				"shoulders",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw
						? new PixelMesh({
								data: `H ${gamepad.axes.lh.toFixed(
									2
								)}\n\nV ${gamepad.axes.lv.toFixed(2)}`
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
			[
				32,
				10,
				"shoulders",
				(gamepad) => {
					return gamepad &&
						gamepad.mapping !== "unknown" &&
						!showingRaw
						? new PixelMesh({
								data: `H ${gamepad.axes.rh.toFixed(
									2
								)}\n\nV ${gamepad.axes.rv.toFixed(2)}`
									.split("\n")
									.map((row) =>
										row
											.split("")
											.map((value) =>
												Pixel.fromString(value)
											)
									),
						  })
						: null;
				},
			],
		];
	}

	generateButtons() {
		this.buttons = [];
		for (let i = 0; i < this.buttonConstructors.length; i++) {
			const [x, y, layer, getRenderable] = this.buttonConstructors[i];

			this.buttons[i] = new Button(
				scene,
				this,
				layer || this.layer,
				x,
				y,
				getRenderable
			);
		}
	}
}

const currentGamepad = new GamepadDisplay(scene, {
	x: 0,
	y: 0,
	color: "grey",
	layer: "system",
	index: 0,
});

currentGamepad.x = width / 2 - currentGamepad.width / 2;
currentGamepad.y = height / 2 - currentGamepad.height / 2;

currentGamepad.generateButtons();

class ControllerSelector extends Text {
	constructor(scene, config) {
		super(scene, config);

		this.index = config.index;

		scene.inputManager.watchObjectClick(this.id, ({ onLayer }) => {
			currentGamepad.index = this.index;

			showGamepad();
		});

		this.updateDisplay();
	}

	get connected() {
		return scene.inputManager.gamepads[this.index];
	}

	updateDisplay() {
		this.value = `${this.index + 1}: ${
			this.connected
				? `${this.connected.id} - Mapping: "${this.connected.mapping}"`
				: "No gamepad connected."
		}`;
		this.color =
			currentGamepad.index === this.index
				? this.connected
					? "green"
					: "red"
				: "grey";
	}
}

const selections = [
	new ControllerSelector(scene, {
		x: 0,
		y: 0,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 0,
	}),
	new ControllerSelector(scene, {
		x: 0,
		y: 1,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 1,
	}),
	new ControllerSelector(scene, {
		x: 0,
		y: 2,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 2,
	}),
	new ControllerSelector(scene, {
		x: 0,
		y: 3,
		value: "",
		wrap: true,
		color: "grey",
		layer: "system",
		index: 3,
	}),
];

const backdrop = new Text(scene, {
	x: currentGamepad.x,
	y: currentGamepad.y + 4,
	layer: "system",
	value: "",
	wrap: true,
});

backdrop.onTick = () => {
	const exists = scene.inputManager.gamepads[currentGamepad.index];

	if (!showingRaw || !exists) return;

	backdrop.value = `Axes:\n${exists.raw.axes
		.map((axis, index) => `${index}: ${axis}`)
		.join("\n")}\n \nButtons:\n${exists.raw.buttons
		.map(
			(button, index) =>
				`${index}: ${button.value.toFixed(2)}${
					index % 3 === 2 ? "\n" : ", "
				}`
		)
		.join("")}`;
};

const showRaw = new Text(scene, {
	x: 0,
	y: 4,
	layer: "system",
	value: "Show Raw Data",
	color: "grey",
	fontWeight: 800,
});
showRaw.x = width / 2 - showRaw.width / 1.5;

scene.inputManager.watchObjectClick(showRaw.id, () => {
	showingRaw = !showingRaw;

	showRaw.color = showingRaw ? "green" : "grey";

	showGamepad();
});

function showGamepad() {
	const exists = scene.inputManager.gamepads[currentGamepad.index];

	if (exists && exists.mapping === "unknown") showingRaw = true;
	showRaw.color = showingRaw ? "green" : "grey";

	if (!exists) {
		currentGamepad.visible = false;
		backdrop.value = `           NO CONTROLLER IN SLOT ${
			currentGamepad.index + 1
		}.\nConnect a controller and then select it above.`;
		backdrop.x =
			currentGamepad.x + currentGamepad.width / 2 - backdrop.width / 2;
		backdrop.y =
			currentGamepad.y + currentGamepad.height / 2 - backdrop.height / 2;
	} else {
		if (showingRaw) {
			backdrop.x = 0;
			backdrop.y = 5;
			currentGamepad.visible = false;
			backdrop.value = "";
		} else {
			currentGamepad.visible = true;
			backdrop.value = "";
		}
	}

	for (const selection of selections) {
		selection.updateDisplay();
	}
}

showGamepad();

scene.inputManager.addEventListener("gamepadconnected", showGamepad);
scene.inputManager.addEventListener("gamepaddisconnected", showGamepad);

runtime.loadScene(scene);
