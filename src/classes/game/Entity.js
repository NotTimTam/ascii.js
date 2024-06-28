import { Pixel } from "../engine/renderer.js";
import GameObject from "../core/GameObject.js";

class Entity extends GameObject {
	/**
	 * An entity is any GameObject that must be rendered to the screen.
	 *
	 * `Entity`s can have a `get renderable()` get method that returns a `Pixel` or `PixelMesh` object for rendering purposes.
	 * `Entity`s do not always need to be rendered, and a `get renderable()` method is not indicative of whether the `Entity`'s logic will function.
	 *
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, true);

		if (typeof x !== "number")
			throw new Error(
				"Entity x-coordinate value must be of type 'number'."
			);

		if (typeof y !== "number")
			throw new Error(
				"Entity y-coordinate value must be of type 'number'."
			);

		this.x = x;
		this.y = y;
	}

	get renderable() {
		return new Pixel("E", "#ffffff");
	}
}

export default Entity;
