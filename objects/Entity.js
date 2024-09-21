import Pixel from "../core/Pixel.js";
import GameObject from "../core/GameObject.js";

class Entity extends GameObject {
	/**
	 * An `Entity` is generally a non-static `GameObject`, interactable in some way.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {number} x This `Entity`'s x-coordinate.
	 * @param {number} y This `Entity`'s y-coordinate.
	 */
	constructor(scene, x, y) {
		super(scene, x, y);
	}

	get renderable() {
		return new Pixel({ value: "E", color: "green" });
	}
}

export default Entity;
