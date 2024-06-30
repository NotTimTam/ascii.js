import { Pixel } from "../engine/renderer.js";
import GameObject from "../core/GameObject.js";

class Entity extends GameObject {
	/**
	 * An `Entity` is generally a non-static `GameObject`, interactable in some way.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Entity`'s x-coordinate.
	 * @param {number} y This `Entity`'s y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);
	}

	get renderable() {
		return new Pixel({value: "E", color: "green"});
	}
}

export default Entity;
