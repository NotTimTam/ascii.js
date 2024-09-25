import Scene from "../engine/Scene.js";

class Core {
	/**
	 * The most core level object.
	 * @param {Scene} scene The scene this Object is a part of.
	 */
	constructor(scene) {
		if (!crypto || !crypto.randomUUID)
			throw new Error(
				'This environment does not support the JavaScript "crypto" library. Only secure contexts (HTTPS) support "crypto.randomUUID".'
			);

		if (!(scene instanceof Scene))
			throw new TypeError(
				'Invalid object provided to Core class constructor. Expected an instance of "Scene".'
			);

		this.scene = scene;

		this.runtime = scene.runtime;

		this.id = crypto.randomUUID();

		console.log(this);
	}
}

export default Core;
