import {
	GameObject,
	Pixel,
	PixelMesh,
	Scene,
	Text,
	TextInput,
} from "../../index.js";
import { version } from "../index.js";

class Log extends GameObject {
	constructor(scene, x, y) {
		super(scene, x, y, "system");

		this.items = [];
	}

	get renderable() {
		const data = this.items
			.map(
				(item) =>
					Text.asPixelMesh(
						item,
						this.scene.runtime.renderer.width,
						true,
						"white",
						undefined,
						400
					).data
			)
			.flat();

		return new PixelMesh({ data });
	}

	write(message) {
		this.items.push(message);
	}
}

const terminal = (runtime) => {
	const scene = new Scene(runtime, {
		label: "terminal",
		layers: [{ label: "gui", parallax: [0, 0] }],
	});

	const log = new Log(scene, 0, 0);
	log.write(`ascii.js gui ${version}`);

	const inputIndicator = new GameObject(
		scene,
		0,
		runtime.renderer.height - 1,
		"gui"
	);
	inputIndicator.renderable = Pixel.fromString(">");

	const input = new TextInput(scene, {
		x: 1,
		y: runtime.renderer.height - 1,
		maxWidth: runtime.renderer.width - 1,
		value: "",
		layer: "gui",
		autoFocus: true,
	});

	return scene;
};

export default terminal;
