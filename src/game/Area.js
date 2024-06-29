import { Pixel, PixelMesh } from "../engine/renderer.js";
import GameObject from "../core/GameObject.js";

class Area extends GameObject {
	/**
	 * An `Area` is generally a static `GameObject` that takes up more than one pixel of space.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `Area`'s x-coordinate.
	 * @param {number} y This `Area`'s y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);
	}

	get renderable() {
		return new PixelMesh([
			[
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
			],
			[
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
			],
			[
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
			],
			[
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
			],
			[
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
				Pixel.fromString("#"),
			],
		]);
	}
}

export default Area;
