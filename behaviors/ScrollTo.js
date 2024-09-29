import Behavior from "../core/Behavior.js";

class ScrollTo extends Behavior {
	/**
	 * Scroll the camera to a `GameObject`.
	 * @param {Scene} scene The scene this Object is a part of.
	 * @param {GameObject} gameObject The game object to append this behavior to.
	 * @param {boolean} enabledByDefault Whether the Behavior starts out enabled. Default: `true`.
	 */
	constructor(scene, gameObject, enabledByDefault = true) {
		super(scene, gameObject, enabledByDefault);
	}

	onTick() {
		if (this.gameObject.paused) return;

		const {
			gameObject: {
				x,
				y,
				width,
				height,
				origin: [oX, oY],
			},
			scene: {
				camera,
				runtime: {
					renderer: { width: screenWidth, height: screenHeight },
				},
			},
		} = this;

		// Put the center of the screen over the center of the object.
		camera.x = x - oX + width / 2 - screenWidth / 2;
		camera.y = y - oY + height / 2 - screenHeight / 2;
	}
}

export default ScrollTo;
