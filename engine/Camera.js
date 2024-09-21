import GameObject from "../core/GameObject.js";
import { aabb } from "../util/math.js";

class Camera extends GameObject {
	/**
	 * The scene contains variable layers and compiles them into one frame to render to the screen.
	 * @param {Scene} scene The scene this Object is a part of.
	 */
	constructor(scene) {
		super(scene, 0, 0);

		this.renderer = scene.renderer;

		this.config = this.renderer.config && this.renderer.config.camera;
	}

	get renderable() {
		return undefined;
	}

	/**
	 * Check if a bounding box is on screen.
	 * @param {number} x The x-coordinate to check.
	 * @param {number} y The y-coordinate to check.
	 * @param {number} width The width to check.
	 * @param {number} height The height to check.
	 * @param {number} parallaxX Optional parallax x-value. (0-1)
	 * @param {number} parallaxY Optional parallax y-value. (0-1)
	 */
	isOnScreen = (x, y, width, height, parallaxX = 1, parallaxY = 1) =>
		aabb(
			x,
			y,
			width,
			height,
			this.x * parallaxX,
			this.y * parallaxY,
			this.renderer.width,
			this.renderer.height
		);
}

export default Camera;
