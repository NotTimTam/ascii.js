import Runtime, {
	GameObject,
	Scene,
	ScrollTo,
	TopDownMovement,
} from "../../index.js";

const runtime = new Runtime({
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
			label: "background",
		},

		{
			label: "entities",
		},
	],
	// onLoad: (scene) => {},
	// onTick: (scene) => {},
});

const { width, height } = runtime.renderer;

const grass = new GameObject(scene, 0, 0, "background");

const player = new GameObject(scene, 5, 5, "entities");
new TopDownMovement(player, true, { defaultControls: true });
new ScrollTo(player, true);

console.log(scene);

runtime.loadScene(scene);
