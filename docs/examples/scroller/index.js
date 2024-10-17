import Runtime, {
	GameObject,
	Menu,
	Pixel,
	PixelMesh,
	Scene,
	Scroller,
	ScrollTo,
	Text,
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

runtime.start((runtime) => {});

const scene = new Scene(runtime, {
	label: "game",
	layers: [],
	// onLoad: (scene) => {},
	// onTick: (scene) => {},
});

const { width, height } = runtime.renderer;

const scroller = new Scroller(scene, {
	x: 0,
	y: 0,
	layer: "system",
	width: 32,
	height: 16,
	gameObjects: [
		new Text(scene, {
			x: 0,
			y: 0,
			layer: "system",
			value: `The quick brown fox jumps over the lazy dog.\n
A big dwarf, who was a jovial friend, quickly packed his hazy box of toys.\n
Jack quickly vexed the lazy dog by jumping over a big fence.\n
Sphinx of black quartz, judge my vow to fix the broken maze of letters.\n
Just when I thought I had everything figured out, a bizarre quiz perplexed me.\n
The five boxing wizards jump quickly to fix the jumbled puzzles in their minds.\n
A quirky fox jumped over the lazy dog and quickly vanished into the night.\n
My big jazz band plays exquisite music while a fox quietly watches nearby.\n
A quirky little gnome jumps over a big black dog, vexing its lazy owner.\n
The wizard quickly mixed a potion with bright, jumping colors from the garden.\n
Just before dawn, a quick breeze swept through the foggy maze of leaves.\n
A jolly fox danced by the quaint village, vexing everyone with its antics.\n
The lazy dog chased a quick, elusive rabbit through the verdant park.\n
Amazingly, the curious bird flew over the jumbled, vibrant garden maze.\n
Six big, joyful penguins quickly waddled around the frozen lake, amusing all.\n`,
		}),
		new Menu(scene, {
			x: 0,
			y: 0,
			items: [
				new Menu.Button({
					label: "Reload Objects",
					callback: () => console.log("RELOAD BUTTON PRESSED"),
				}),
				new Menu.Slider({
					value: 0,
					min: 0,
					max: 10,
					step: 1,
					label: "Volume",
					showValue: false,
					showPercentage: true,
					onChange: (v) => {
						console.log("CHANGED", v);
					},
					callback: (v) => console.log("ENTER ON SLIDER", v),
				}),
				new Menu.Toggle({
					label: "Mute Audio",
					callback: (checked) =>
						console.log(
							"CHECKBOX",
							checked ? "CHECKED" : "UNCHECKED"
						),
				}),
				new Menu.Button({
					label: "Save Changes",
					callback: () => console.log("SAVE BUTTON PRESSED"),
				}),
				new Menu.Button({
					label: "Exit",
					callback: () => console.log("EXIT BUTTON PRESSED"),
				}),
			],
			title: "Example Menu",
			layer: "system",
			gamepad: -1,
		}),
	],
});

new ScrollTo(scroller);

runtime.loadScene(scene);
