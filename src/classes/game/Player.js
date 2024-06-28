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

	get pixel() {
		return new Pixel("P", "cyan");
	}
}

export default Player;
