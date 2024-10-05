import Runtime, {
	Scene,
	Animate,
	Animation,
	AnimationFrame,
	ScrollTo,
	GameObject,
	PixelMesh,
} from "../../index.js";
import terminal from "./terminal/index.js";

export const version = "0.0.0";

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
						`  □▣■  \n ▪      \n▫   |    \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ▪□▣■ \n        \n    /    \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`   ▪□▣■\n        \n    –    \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`    ▪□▣\n       ■\n    \\    \n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`     ▪□\n       ▣\n    |   ■\n        \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`      ▪\n       □\n    /   ▣\n       ■\n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n       ▪\n    –   □\n       ▣\n      ■`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n    \\   ▪\n       □\n     ■▣`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n    |    \n       ▪\n    ■▣□`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n    /    \n        \n   ■▣□▪`
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n    –    \n        \n  ■▣□▪ `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n    \\    \n ■      \n  ▣□▪  `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n        \n■   |    \n ▣      \n  □▪   `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`       \n ■      \n▣   /    \n □      \n  ▪    `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ■    \n ▣      \n□   –    \n ▪      \n       `
					)
				),
				new AnimationFrame(
					PixelMesh.fromString(
						`  ▣■   \n □      \n▪   \\    \n        \n       `
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

runtime.loadScene(scene);

setTimeout(() => runtime.loadScene(terminal(runtime)), 150);
