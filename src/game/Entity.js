import { Pixel } from "../engine/renderer.js";
import GameObject from "../core/GameObject.js";

class Entity extends GameObject {
	/**
	 * An entity is generally a non-static `GameObject`, interactable in some way.
	 *
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);
	}

	get renderable() {
		return new Pixel("E", "green");
	}
}

export default Entity;
