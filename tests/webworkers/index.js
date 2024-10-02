import Runtime, {
	Animate,
	Animation,
	AnimationFrame,
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

		useWebWorkers: true,
	},
});

runtime.start((runtime) => {});

const scene = new Scene(runtime, {
	label: "game",
	layers: [
		{
			label: "warning",
		},
	],
});

new Text(scene, {
	layer: "warning",
	x: 0,
	y: 0,
	value: "WARNING FLASHING CHARACTERS!!!",
});

scene.layerManager.getLayerByLabel("system").visible = false;

const { width, height } = runtime.renderer;

const pixelMeshGenerator = (offset = 0) =>
	new PixelMesh({
		data: new Array(height).fill(null).map((_, y) =>
			new Array(width).fill(null).map((_, x) => {
				const localized = (x + offset + (y % 2 === 0 ? 0 : 4)) % 7;

				switch (localized) {
					case 0:
						return new Pixel({
							value: ")",
							color: "red",
						});
					case 1:
						return new Pixel({
							value: ")",
							color: "orange",
						});
					case 2:
						return new Pixel({
							value: ")",
							color: "tomato",
						});
					case 3:
						return new Pixel({
							value: ")",
							color: "green",
						});
					case 4:
						return new Pixel({
							value: ")",
							color: "blue",
						});
					case 5:
						return new Pixel({
							value: ")",
							color: "indigo",
						});
					case 6:
						return new Pixel({
							value: ")",
							color: "purple",
						});
				}
			})
		),
	});

const animatable = new GameObject(scene, 0, 0, "system");
new ScrollTo(animatable, true);
const animate = new Animate(animatable, true, {
	animations: [
		new Animation({
			label: "anim1",
			animationFrames: [
				new AnimationFrame(pixelMeshGenerator(6)),
				new AnimationFrame(pixelMeshGenerator(5)),
				new AnimationFrame(pixelMeshGenerator(4)),
				new AnimationFrame(pixelMeshGenerator(3)),
				new AnimationFrame(pixelMeshGenerator(2)),
				new AnimationFrame(pixelMeshGenerator(1)),
				new AnimationFrame(pixelMeshGenerator(0)),
			],
			speed: 24,
			loop: true,
		}),
	],
	initialAnimation: "anim1",
	initialFrame: 0,
	overwriteObjectRenderable: true,
});

const frameRate = new Text(scene, {
	x: width / 2,
	y: height / 2,
	value: "0FPS",
	color: "white",
	fontWeight: 800,
	layer: "system",
});

frameRate.onTick = () => {
	frameRate.value = `${Math.round(runtime.fps)}FPS - DELTA TIME: ${Math.round(
		runtime.dt * 1000
	)}ms`;
	frameRate.x = width / 2 - frameRate.value.length / 2;
};

const webWorkerToggle = new Text(scene, {
	x: width / 2,
	y: height / 2 + 1,
	value: `Webworkers ${runtime.renderer.useWebWorkers ? "On" : "Off"}`,
	color: runtime.renderer.useWebWorkers ? "green" : "red",
	fontWeight: 800,
	layer: "system",
});
webWorkerToggle.x = width / 2 - webWorkerToggle.value.length / 2;

scene.inputManager.watchObjectClick(webWorkerToggle.id, () => {
	runtime.renderer.useWebWorkers = !runtime.renderer.useWebWorkers;

	webWorkerToggle.value = `Webworkers ${
		runtime.renderer.useWebWorkers ? "On" : "Off"
	}`;
	webWorkerToggle.color = runtime.renderer.useWebWorkers ? "green" : "red";
	webWorkerToggle.x = width / 2 - webWorkerToggle.value.length / 2;
});

runtime.loadScene(scene);
