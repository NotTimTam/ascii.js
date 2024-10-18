import UIObject from "../../../core/UIObject.js";
import Runtime, {
	Menu,
	Scene,
	ScrollTo,
	Text,
	TextInput,
} from "../../../index.js";

// "https://cdn.jsdelivr.net/gh/nottimtam/ascii.js/dist/build.js";

const runtime = new Runtime({
	renderer: {
		resolution: [96, 32],

		canvas: document.querySelector("canvas.display"),

		fontSize: "24px",
		scaling: "letterbox",

		renderMode: "stacked",
	},
});

runtime.start();

const scene = new Scene(runtime, {
	label: "game",
});

// const menu = new Menu(scene, {
// 	x: 0,
// 	y: 0,
// 	items: [
// 		new Menu.Button({
// 			label: "Button A",
// 		}),
// 		new Menu.Button({
// 			label: "Button B",
// 		}),
// 		new Menu.Button({
// 			label: "Button C",
// 		}),
// 	],
// 	title: "Menu 1",
// 	layer: "system",
// 	gamepad: -1,
// });

// const menu2 = new Menu(scene, {
// 	x: 14,
// 	y: 0,
// 	items: [
// 		new Menu.Button({
// 			label: "Button D",
// 		}),
// 		new Menu.Button({
// 			label: "Button E",
// 		}),
// 		new Menu.Button({
// 			label: "Button F",
// 		}),
// 	],
// 	title: "Menu 2",
// 	layer: "system",
// 	gamepad: -1,
// });

// const menu3 = new Menu(scene, {
// 	x: 28,
// 	y: 0,
// 	items: [
// 		new Menu.Button({
// 			label: "Button G",
// 		}),
// 		new Menu.Button({
// 			label: "Button H",
// 		}),
// 		new Menu.Button({
// 			label: "Button I",
// 		}),
// 	],
// 	title: "Menu 3",
// 	layer: "system",
// 	gamepad: -1,
// });

// new ScrollTo(menu2);

class FocusIndicator extends UIObject {
	constructor(scene, config) {
		super(scene, config);

		this.tabIndex = config.tabIndex || 0;

		this.addEventListener("click", (e) => {
			console.log(
				scene.inputManager.uIObjects.indexOf(this).toString(),
				"CLICKED! TABINDEX:",
				this.tabIndex.toString()
			);
		});
	}

	get renderable() {
		const { focused, tabIndex } = this;
		return Text.asPixelMesh(
			`tabIndex: ${tabIndex} - ${focused ? "Focused" : "Unfocused"}`,
			undefined,
			undefined,
			focused ? "magenta" : "grey"
		);
	}

	set renderable(_) {
		return;
	}
}

new FocusIndicator(scene, { x: 2, y: 0, layer: "system", tabIndex: 3 });
new FocusIndicator(scene, { x: 2, y: 2, layer: "system", tabIndex: 4 });
new FocusIndicator(scene, { x: 2, y: 4, layer: "system", tabIndex: 5 });
new FocusIndicator(scene, { x: 2, y: 6, layer: "system", tabIndex: 2 });
new FocusIndicator(scene, { x: 2, y: 8, layer: "system", tabIndex: 1 });
new FocusIndicator(scene, { x: 2, y: 10, layer: "system", tabIndex: 0 });

new TextInput(scene, {
	x: 2,
	y: 12,
	value: "Hello world!",
	layer: "system",
	maxWidth: 32,
});

runtime.loadScene(scene);
