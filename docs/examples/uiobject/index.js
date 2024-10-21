import UIObject from "../../../core/UIObject.js";
import Runtime, {
	Menu,
	Pixel,
	PixelMesh,
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
	layers: [{ label: "BOTTOM" }, { label: "TOP" }],
});

new Menu(scene, {
	x: 0,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button A",
		}),
		new Menu.Button({
			label: "Button B",
		}),
		new Menu.Button({
			label: "Button C",
		}),
	],
	title: "Menu 1",
	layer: "system",
	gamepad: -1,
});

const menuCenter = new Menu(scene, {
	x: 14,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button D",
		}),
		new Menu.Button({
			label: "Button E",
		}),
		new Menu.Button({
			label: "Button F",
		}),
	],
	title: "Menu 2",
	layer: "system",
	gamepad: -1,
});

new Menu(scene, {
	x: 28,
	y: 0,
	items: [
		new Menu.Button({
			label: "Button G",
			callback: () => console.log("G CLICKED"),
		}),
		new Menu.Button({
			label: "Button H",
			callback: () => console.log("H CLICKED"),
		}),
		new Menu.Button({
			label: "Button I",
			callback: () => console.log("I CLICKED"),
		}),
		new Menu.Slider({
			label: "Slider",
			callback: () => console.log("SLIDER CLICKED"),
			step: 0.1,
		}),
		new Menu.Toggle({
			label: "Checkbox",
			callback: () => console.log("CHECKBOX CLICKED"),
		}),
	],
	title: "Menu 3",
	layer: "system",
	gamepad: -1,
	autoFocus: true,
});

// new ScrollTo(menuCenter);

// class FocusIndicator extends UIObject {
// 	constructor(scene, config) {
// 		super(scene, config);

// 		this.addEventListener("mousemove", (e) => {
// 			this.onThis = e.onUIObject;
// 		});

// 		this.addEventListener("mouseleave", (e) => {
// 			this.onThis = null;
// 		});
// 	}

// 	get renderable() {
// 		const { focused, tabIndex } = this;

// 		let data = [];

// 		data.push(
// 			`tabIndex: ${tabIndex} - ${
// 				focused ? "Focused" : "Unfocused"
// 			} - ${Math.round(this.scene.runtime.fps).toString()}`
// 				.split("")
// 				.map(
// 					(char, index) =>
// 						new Pixel({
// 							value: char,
// 							color:
// 								this.onThis && this.onThis[0] === index
// 									? "lime"
// 									: focused
// 									? "magenta"
// 									: "grey",
// 						})
// 				)
// 		);

// 		return new PixelMesh({ data });
// 	}

// 	set renderable(_) {
// 		return;
// 	}
// }

// new FocusIndicator(scene, { x: 2, y: 0, layer: "system", tabIndex: 3 });
// new FocusIndicator(scene, { x: 2, y: 2, layer: "system", tabIndex: 4 });
// new FocusIndicator(scene, { x: 2, y: 4, layer: "system", tabIndex: 5 });
// new FocusIndicator(scene, { x: 2, y: 6, layer: "system", tabIndex: 2 });
// new FocusIndicator(scene, { x: 2, y: 8, layer: "system", tabIndex: 1 });
// new FocusIndicator(scene, { x: 2, y: 10, layer: "system", tabIndex: 0 });

// new FocusIndicator(scene, { x: 2, y: 12, layer: "BOTTOM", tabIndex: 0 });
// new FocusIndicator(scene, { x: 2, y: 12, layer: "TOP", tabIndex: 0 });

new TextInput(scene, {
	x: 2,
	y: 12,
	value: "Hello world!",
	layer: "system",
	maxWidth: 32,
	autoFocus: true,
	// maintainFocus: true,
});

runtime.loadScene(scene);
