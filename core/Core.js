import Scene from "../engine/Scene.js";

class Core {
	/**
	 * The most core level object.
	 * @param {Scene} scene The scene this Object is a part of.
	 */
	constructor(scene) {
		if (!(scene instanceof Scene))
			throw new TypeError(
				'Invalid object provided to Core class constructor. Expected an instance of "Scene".'
			);

		this.scene = scene;

		this.runtime = scene.runtime;
	}
}

export default Core;
