import Runtime, { Scene } from "../../index.js";
import Animate, { Animation, AnimationFrame } from "../behaviors/Animate.js";
import ScrollTo from "../behaviors/ScrollTo.js";
import GameObject from "../core/GameObject.js";
import { PixelMesh } from "../core/Pixel.js";
import Text from "../objects/Text.js";

const runtime = new Runtime({
	renderer: {
		resolution: [64, 32],

		canvas: document.querySelector("canvas"),

		fontSize: "32px",
		scaling: "letterbox",

		renderMode: "stacked",
	},
});

runtime.start((runtime) => {});

const scene = new Scene(runtime, {
	label: "loader",
});

const loader = new GameObject(scene, 0, 0, "system");
new Animate(loader, {
	animations: [
		new Animation({
			label: "loader",
			animationFrames: [
				new AnimationFrame(
					PixelMesh.fromString(
						`  □▣■  \n ▪      \n▫        \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ▪□▣■ \n        \n         \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`   ▪□▣■\n        \n         \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`    ▪□▣\n       ■\n         \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`     ▪□\n       ▣\n        ■\n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`      ▪\n       □\n        ▣\n       ■\n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n       ▪\n        □\n       ▣\n      ■`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n        ▪\n       □\n     ■▣`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n         \n       ▪\n    ■▣□`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n         \n        \n   ■▣□▪`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n         \n        \n  ■▣□▪ `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n         \n ■      \n  ▣□▪  `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n■        \n ▣      \n  □▪   `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n ■      \n▣        \n □      \n  ▪    `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ■    \n ▣      \n□        \n ▪      \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ▣■   \n □      \n▪        \n        \n       `
					)
				),
			],
			speed: 42,
			loop: true,
		}),
	],
	overwriteObjectRenderable: true,
	initialAnimation: "loader",
});
new ScrollTo(loader);

console.log(loader);

new Text(scene, {
	x: loader.x - 3,
	y: loader.y + loader.height + 1,
	value: "ascii.js - gui",
	layer: "system",
});

runtime.loadScene(scene);
