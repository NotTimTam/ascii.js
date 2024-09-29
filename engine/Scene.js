import Camera from "./Camera.js";
import InputManager from "./InputManager.js";
import LayerManager from "./LayerManager.js";
import Runtime from "./Runtime.js";

class Scene {
	/**
	 * A scene is a level, screen, or world that can be load in at any point during the runtime.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {Object} config The `Scene` configuration object.
	 * @param {string} config.label The `Scene`'s label.
	 * @param {Array<Object>} config.layers An optional array of configuration objects for each layer in the `Scene`.
	 * @param {string} config.layers[].label The layer's label.
	 * @param {Array<number>} [config.layers[].parallax] Optional parallax data, where the format is [integer, integer]. (`[1, 1]` is 100% parallax, `[0, 0]` is 0% parallax)
	 * @param {Array<function>} [config.layers[].gameObjectConstructors] Optional callback functions that return `GameObject`s for this layer.
	 * @param {function} [config.layers[].gameObjectConstructors[]] A callback function, passed this `Scene` as an argument, that return an instance of `GameObject`.
	 * @param {function} config.onLoad A callback (passed this `Scene` as an argument) that runs when the `Scene` has finished loading.
	 * @param {function} config.onTick A callback (passed this `Scene` as an argument) that runs every frame that this `Scene` is loaded.
	 */
	constructor(runtime, config) {
		this.runtime = runtime;

		if (!runtime || !(runtime instanceof Runtime))
			throw new TypeError(
				"Scene constructor was not provided an instance of Runtime."
			);

		Scene.validateConfig(config);

		const { label, layers, onLoad, onTick } = config;

		this.label = label;

		this.camera = new Camera(this);

		this.layerManager = new LayerManager(this, layers);

		this.inputManager = new InputManager(this);

		if (onLoad) this.onLoadPassthrough = onLoad;
		if (onTick) this.onTickPassthrough = onTick;

		this.__onTick.bind(this);

		this.__onLoad();
	}

	/**
	 * Get the number of `GameObject`s in the current scene.
	 */
	get gameObjects() {
		return this.layerManager.layers // Get all layers.
			.map(({ gameObjects }) => gameObjects.length) // Get the number of game objects in each layer.
			.reduce((a, b) => a + b); // Add up all the numbers.
	}

	/**
	 * Validates a scene configuration file and throws an error if it is invalid.
	 * @param {Object} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!isPlainObject(config))
			throw new TypeError(
				"Expected a plain object for Scene constructor config parameter."
			);

		if (!config.label || typeof config.label !== "string")
			throw new Error(
				`Invalid label value provided to Scene configuration: "${config.label}". Must be a string.`
			);

		if (config.layers) {
			if (!(config.layers instanceof Array))
				throw new TypeError(
					`Scene configuration "layers" property should be an array.`
				);

			for (const layer of config.layers) {
				if (!layer)
					throw new Error(
						`Invalid layer provided to Scene layers config: ${layer}`
					);

				if (!layer.label)
					throw new Error(
						"No label provided to layer in Scene config."
					);

				if (typeof layer.label !== "string")
					throw new Error(
						`Provided layer name <${layerName}> is not of type 'string'.`
					);

				if (layer.parallax) {
					if (
						!(layer.parallax instanceof Array) ||
						typeof layer.parallax[0] !== "number" ||
						typeof layer.parallax[1] !== "number"
					)
						throw new Error(
							`Invalid parallax data provided to layer configuration. Required format: [<x>, <y>]`
						);
				}

				if (layer.gameObjectConstructors) {
					if (!(layer.gameObjectConstructors instanceof Array))
						throw new Error(
							`Invalid "gameObjectConstructors" data provided to layer configuration. Required format: [(scene) => { return <instance of GameObject> }]`
						);

					for (const gameObjectConstructor of layer.gameObjectConstructors)
						if (typeof gameObjectConstructor !== "function")
							throw new Error(
								`gameObjectConstructors array must contain callback functions that return constructed GameObject instances.`
							);
				}
			}
		}

		if (config.onLoad && typeof config.onLoad !== "function")
			throw new Error(
				`"onLoad" method provided to scene config is not of type "function".`
			);

		if (config.onTick && typeof config.onTick !== "function")
			throw new Error(
				`"onTick" method provided to scene config is not of type "function".`
			);
	}

	/**
	 * Unload the scene.
	 */
	__unLoad() {
		this.inputManager.__unLoad(); // Unload input events.
	}

	__onLoad() {
		this.layerManager.__onLoad();

		if (this.onLoadPassthrough) this.onLoadPassthrough(this);
	}

	__onTick() {
		this.layerManager.__onTick();

		if (this.onTickPassthrough) this.onTickPassthrough(this);
	}
}

export default Scene;
