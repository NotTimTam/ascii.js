import GameObject from "../core/GameObject.js";
import Pixel, { PixelMesh } from "../core/Pixel.js";

class Area extends GameObject {
	/**
	 * An `Area` is generally a static `GameObject` that takes up more than one pixel of space.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {number} x This `Area`'s x-coordinate.
	 * @param {number} y This `Area`'s y-coordinate.
	 * @param {boolean} solid Whether the area's renderable is solid. Empty spaces in the renderable are not solid.
	 */
	constructor(scene, x, y, solid = false) {
		super(scene, x, y);

		this.solid = solid;
	}

	get renderable() {
		const p = new Pixel({ value: "#", solid: this.solid });

		return new PixelMesh({
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
}

export default Area;
