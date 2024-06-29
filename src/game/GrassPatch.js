import { Pixel, PixelMesh } from "../engine/renderer.js";
import { clamp } from "../util/math.js";
import Area from "./Area.js";

class GrassPatch extends Area {
	/**
	 * A decorative, procedurally generated, patch of grass.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This `GrassPatch`'s x-coordinate.
	 * @param {number} y This `GrassPatch`'s y-coordinate.
	 * @param {number} width This `GrassPatch`'s x-coordinate.
	 * @param {number} height This `GrassPatch`'s y-coordinate.
	 */
	constructor(runtime, x, y, width, height) {
		super(runtime, x, y);

		this.__generate(width, height);
	}

	/**
	 *
	 * @param {number} width This `GrassPatch`'s width.
	 * @param {number} height This `GrassPatch`'s height.
	 */
	__generate(width, height) {
		this.data = [];

		for (let y = 0; y < height; y++) {
			const row = [];

			for (let x = 0; x < width; x++) {
				const scale = 15;

				const n = Math.floor(
					Math.abs(
						this.runtime.noise.simplex2(
							(this.x + x) / scale,
							(this.y + y) / scale
						)
					) * 10
				);

				const o = Math.round(
					Math.abs(
						this.runtime.noise.simplex2(
							(this.x + x) * scale,
							(this.y + y) * scale
						)
					) * 255
				);

				const pixel = new Pixel(
					["*", "~", ";", ":", ",", ".", "´", " ", " ", " "][n],
					o < 240 ? `rgb(0, ${clamp(o, 50, 200)}, 0)` : "#FFD464",
					100,
					`rgb(0, 100, 0)`
				);

				row.push(pixel);
			}

			this.data.push(row);
		}
	}

	get renderable() {
		return new PixelMesh(this.data);
	}
}

export default GrassPatch;
