import Behavior from "../core/Behavior.js";

class ScrollTo extends Behavior {
	/**
	 * A core object that modifies the behavior of a GameObject.
	 * @param {Runtime} runtime The main runtime object.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(runtime, gameObject, enabledByDefault = true) {
		super(runtime, gameObject, enabledByDefault);
	}

	__onTick() {
		const {
			gameObject: {
				x,
				y,
				renderable: { width, height },
			},
			runtime: {
				renderer: { camera, width: screenWidth, height: screenHeight },
			},
		} = this;

		// Put the center of the screen over the center of the object.
		camera.x = x + width / 2 - screenWidth / 2;
		camera.y = y + height / 2 - screenHeight / 2;
	}
}

export default ScrollTo;
