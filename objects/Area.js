import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";

class Area extends GameObject {
	/**
	 * An `Area` is generally a static `GameObject` that takes up more than one pixel of space.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {number} x This `Area`'s x-coordinate.
	 * @param {number} y This `Area`'s y-coordinate.
	 * @param {boolean} solid Whether the area's renderable is solid. Empty spaces in the renderable are not solid.
	 * @param {string} layer The label of the layer to start the `Area` on.
	 */
	constructor(scene, x, y, solid = false, layer) {
		super(scene, x, y, layer);

		this.solid = solid;

		const p = new Pixel({ value: "#", solid: this.solid });

		this.__rawRenderable = new PixelMesh({
			data: [
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
				[p, p, p, p, p],
			],
		});
	}

	/**
	 * The `Area`'s renderable element.
	 */
	get renderable() {
		return this.__rawRenderable;
	}

	/**
	 * Set this `Area`'s renderable.
	 */
	set renderable(value) {
		if (value && !(value instanceof PixelMesh))
			throw new TypeError(
				"A Area's renderable property must be an instance of PixelMesh, or falsey."
			);

		this.__rawRenderable = value;
	}
}

export default Area;
