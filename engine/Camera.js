import { aabb } from "../util/math.js";
import Scene from "./Scene.js";

class Camera {
	/**
	 * The scene contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Scene} scene The `Scene` this `Camera` is a part of.
	 */
	constructor(scene) {
		this.scene = scene;

		this.__rawX = 0;
		this.__rawY = 0;
	}

	/**
	 * Check if a bounding box is on screen.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {number} width The width to check.
	 * @param {number} height The height to check.
	 * @param {?number} parallaxX Optional parallax x-value.
	 * @param {?number} parallaxY Optional parallax y-value.
	 */
	isOnScreen = (x, y, width, height, parallaxX = 1, parallaxY = 1) =>
		aabb(
			x,
			y,
			width,
			height,
			this.x * parallaxX,
			this.y * parallaxY,
			this.scene.runtime.renderer.width,
			this.scene.runtime.renderer.height
		);

	/**
	 * Get the game object's adjusted x-coordinate.
	 */
	get x() {
		return Math.round(this.__rawX);
	}

	/**
	 * Set the game object's x-coordinate.
	 */
	set x(n) {
		if (typeof n !== "number")
			throw new Error(
				"Camera x-coordinate value must be of type 'number'."
			);
		this.__rawX = n;
	}

	/**
	 * Get the game object's adjusted y-coordinate.
	 */
	get y() {
		return Math.round(this.__rawY);
	}

	/**
	 * Set the game object's y-coordinate.
	 */
	set y(n) {
		if (typeof n !== "number")
			throw new Error(
				"Camera y-coordinate value must be of type 'number'."
			);
		this.__rawY = n;
	}
}

export default Camera;
