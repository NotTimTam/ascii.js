class Scene {
	/**
	 * A scene is a level, screen, or world that can be load in at any point during the runtime.
	 * @param {*} config The scene configuration object.
	 */
	constructor(config) {
		Scene.validateConfig(config);

		const { label, layers, onLoad, onTick } = config;

		this.label = label;
		this.layers = layers;

		if (onLoad) this.__onLoad = onLoad;
		if (onTick) this.__onTick = onTick;
	}

	/**
	 * Validates a scene configuration file and throws an error if it is invalid.
	 * @param {*} config The config object to validate.
	 */
	static validateConfig(config) {
		if (!config.label || typeof config.label !== "string")
			throw new Error(
				`Invalid label value provided to Scene configuration: "${config.label}". Must be a string.`
			);

		if (!config.layers || config.layers.length === 0)
			throw new Error(
				"No 'layers' configuration provided to LayerManager config."
			);

		for (const layer of config.layers) {
			if (!layer)
				throw new Error(
					`Invalid layer provided to Scene layers config: ${layer}`
				);

			if (!layer.label)
				throw new Error("No label provided to layer in Scene config.");

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
}

export default Scene;