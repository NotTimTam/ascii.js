import Renderer, { Frame, Pixel } from "./renderer.js";
import Core from "../core/Core.js";

export class Layer extends Core {
	/**
	 * A layer is a construct of other objects. The layer manages these objects and can optionally render them to the screen.
	 * @param {LayerManager} layerManager The `LayerManager` parent object.
	 * @param {string} label This layer's label.
	 */
	constructor(layerManager, label) {
		super(layerManager.runtime);

		this.layerManager = layerManager;
		this.label = label;

		this.layerManager.layers.push(this);

		this.gameObjects = [];
	}

	/**
	 * Returns a frame composed of a layer's objects.
	 */
	get frame() {
		return new Frame([
			...`REMOVED${" ".repeat(
				this.runtime.renderer.width *
					this.layerManager.layers.indexOf(this)
			)}`
				.split("")
				.map((letter) => Pixel.fromString(letter)),
		]);
	}
}

class LayerManager {
	/**
	 * The layer manager contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Renderer} renderer The main runtime's renderer object.
	 */
	constructor(renderer) {
		this.renderer = renderer;
		this.runtime = renderer.runtime;
		this.config = this.renderer.config && this.renderer.config.layerManager;

		LayerManager.validateConfig(this.config);

		this.layers = [];
	}

	/**
	 * Validates a renderer configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config.layers || config.layers.length === 0)
			throw new Error(
				"No 'layers' configuration provided to LayerManager config."
			);

		for (const layerName of config.layers)
			if (typeof layerName !== "string")
				throw new Error(
					`Provided layer name <${layerName}> is not of type 'string'.`
				);
	}

	__onStartup() {
		const { layers } = this.config;

		for (const layer of layers) new Layer(this, layer);
	}

	__onTick() {
		const {
			runtime: { renderer },
		} = this;
		const frame = renderer.compileFrames(
			...this.layers.map((layer) => layer.frame)
		);

		renderer.drawFrame(frame);
	}
}

export default LayerManager;
