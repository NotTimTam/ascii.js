import { Pixel } from "../engine/renderer.js";
import Entity from "./Entity.js";

class Player extends Entity {
	/**
	 * The player entity.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {number} x This entity's x-coordinate.
	 * @param {number} y This entity's y-coordinate.
	 */
	constructor(runtime, x, y) {
		super(runtime, x, y);
	}

	get renderable() {
		return new Pixel(
			(this.runtime.walltime / 8) % 64 > 32 ? "☺" : "P",
			"cyan",
			"800"
		);
	}

	__onTick() {
		const { runtime } = this;

		this.x = (runtime.walltime / 64) % 64;
		this.y = (runtime.walltime / 128) % 8;
	}
}

export default Player;
