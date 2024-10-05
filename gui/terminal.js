import {
	GameObject,
	Pixel,
	PixelMesh,
	Scene,
	Text,
	TextInput,
} from "../index.js";
import editor from "./editor/index.js";
import { version } from "./index.js";

class Log extends GameObject {
	constructor(scene, x, y) {
		super(scene, x, y, "system");

		this.items = [];
	}

	get maxLines() {
		return this.scene.runtime.renderer.height - 1;
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

		return new PixelMesh({
			data: data.splice(-this.maxLines),
		});
	}

	write(message) {
		this.items.push(message);

		while (this.items.length > this.maxLines) this.items.shift();
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

	const commands = {
		args: {
			help: {
				callback: (...args) => {
					if (args.length > 2)
						throw new Error(
							'Too many arguments provided to "help" command. 1 expected.'
						);

					const [_, topic] = args;

					if (!topic)
						log.write(
							"Commands:\nhelp  | Get help with commands.\ncarts | View your cartridges.\nnew   | Create a new cartridge."
						);
				},
			},
			carts: {
				callback: () => {},
			},
			new: {
				callback: () => {
					try {
						runtime.loadScene(editor(runtime));
					} catch (err) {
						console.error(err);

						log.write(`Failed to open editor: ${err.message}`);
					}
				},
			},
		},
	};

	new TextInput(scene, {
		x: 1,
		y: runtime.renderer.height - 1,
		maxWidth: runtime.renderer.width - 1,
		value: "",
		layer: "gui",
		autoFocus: true,
		onBlur: (textInput) => (textInput.focused = true),
		onKeyDown: ({ target, keys: { enter } }) => {
			if (!enter || !target.value || target.value.trim() === "") return;

			try {
				const args = target.value.trim().split(" ");

				target.value = "";

				for (const arg in args) args[arg] = args[arg].trim();

				let currentArg = commands;
				for (let i = 0; i < args.length; i++) {
					const arg = args[i];

					if (currentArg.args && currentArg.args[arg])
						currentArg = currentArg.args[arg];
					else if (currentArg.callback)
						return currentArg.callback(...args);
					else throw new Error(`Invalid argument: "${arg}"`);
				}

				if (currentArg.callback) currentArg.callback(...args);
			} catch (err) {
				console.error(err);

				log.write(err.message);
			}
		},
	});

	return scene;
};

export default terminal;
